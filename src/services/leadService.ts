import Lead from '../models/Lead';
import { AppError, getPagination, buildSort } from '../utils/helpers';
import { FilterQuery } from 'mongoose';

export const getLeads = async (query: Record<string, string>) => {
  const { page, limit, skip } = getPagination({ query } as never);
  const filter: FilterQuery<typeof Lead> = {};

  if (query.status) filter.status = query.status;
  if (query.leadSource) filter.leadSource = query.leadSource;
  if (query.assignedTo) filter.assignedTo = query.assignedTo;
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
      { company: { $regex: query.search, $options: 'i' } },
    ];
  }

  const sort = buildSort(query.sortBy, query.order);

  const [leads, total] = await Promise.all([
    Lead.find(filter)
      .populate('assignedTo', 'name email')
      .populate('product', 'name sku')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Lead.countDocuments(filter),
  ]);

  return { leads, total, page, limit, pages: Math.ceil(total / limit) };
};

export const createLead = async (data: Record<string, unknown>) => {
  const lead = await Lead.create({
    ...data,
    timeline: [{ action: 'created', description: 'Lead created', createdAt: new Date() }],
  });
  return lead;
};

export const updateLead = async (id: string, data: Record<string, unknown>, adminId?: string) => {
  const lead = await Lead.findById(id);
  if (!lead) throw new AppError('Lead not found', 404);

  if (data.status && data.status !== lead.status) {
    lead.timeline.push({
      action: 'status_changed',
      description: `Status changed to ${data.status}`,
      createdBy: adminId as never,
      createdAt: new Date(),
    });
  }

  Object.assign(lead, data);
  await lead.save();
  return lead.populate(['assignedTo', 'product']);
};

export const addLeadNote = async (id: string, text: string, adminId: string) => {
  const lead = await Lead.findById(id);
  if (!lead) throw new AppError('Lead not found', 404);

  lead.notes.push({ text, createdBy: adminId as never, createdAt: new Date() });
  lead.timeline.push({
    action: 'note_added',
    description: 'Note added',
    createdBy: adminId as never,
    createdAt: new Date(),
  });
  await lead.save();
  return lead;
};

export const assignLead = async (id: string, assignedTo: string, adminId: string) => {
  const lead = await Lead.findByIdAndUpdate(
    id,
    { assignedTo },
    { new: true }
  ).populate('assignedTo', 'name email');
  if (!lead) throw new AppError('Lead not found', 404);

  lead.timeline.push({
    action: 'assigned',
    description: 'Lead assigned to sales executive',
    createdBy: adminId as never,
    createdAt: new Date(),
  });
  await lead.save();
  return lead;
};
