import Catalogue from '../models/Catalogue';
import Download from '../models/Download';
import { AppError, generateSlug, getPagination } from '../utils/helpers';

export const getCatalogues = async (query: Record<string, string>) => {
  const { page, limit, skip } = getPagination({ query } as never);
  const [catalogues, total] = await Promise.all([
    Catalogue.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Catalogue.countDocuments(),
  ]);
  return { catalogues, total, page, limit, pages: Math.ceil(total / limit) };
};

export const createCatalogue = async (data: Record<string, unknown>) => {
  if (!data.slug) data.slug = generateSlug(data.title as string);
  return Catalogue.create(data);
};

export const trackDownload = async (catalogueId: string, visitorData: Record<string, unknown>) => {
  const catalogue = await Catalogue.findById(catalogueId);
  if (!catalogue) throw new AppError('Catalogue not found', 404);

  catalogue.downloadCount += 1;
  await catalogue.save();

  await Download.create({ catalogue: catalogueId, ...visitorData });
  return catalogue;
};

export const deleteCatalogue = async (id: string) => {
  const catalogue = await Catalogue.findByIdAndDelete(id);
  if (!catalogue) throw new AppError('Catalogue not found', 404);
  return catalogue;
};
