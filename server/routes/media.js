import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all media
router.get('/', async (req, res) => {
  try {
    const media = await req.prisma.media.findMany({
      orderBy: { uploadedAt: 'desc' }
    });
    res.json(media);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

// Upload media (base64)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { url, name, type, size, alt } = req.body;

    const media = await req.prisma.media.create({
      data: { url, name, type, size, alt }
    });

    res.status(201).json(media);
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload media' });
  }
});

// Delete media
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await req.prisma.media.delete({ where: { id: req.params.id } });
    res.json({ message: 'Media deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete media' });
  }
});

export default router;
