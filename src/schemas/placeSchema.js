import { z } from 'zod'

export const contentSchema = z.object({
  lang: z.string().length(2, 'Debe tener 2 caracteres').toLowerCase(),
  name: z.string().min(10).max(30),
  text: z.string().min(500).max(800),
})

export const placeSchema = z.object({
  content: z.array(contentSchema).min(1),
  images: z
    .array(z.string().min(10)) // asumimos base64 mínima
    .min(1, 'Se requiere al menos una imagen')
    .max(10, 'Máximo 10 imágenes'),
  lat: z.number({ invalid_type_error: 'Debe ser un número' }).min(-90).max(90),
  lon: z.number({ invalid_type_error: 'Debe ser un número' }).min(-180).max(180),
  published: z.boolean().optional(),
})
