import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all settings
router.get('/', async (req, res) => {
  try {
    const settings = await req.prisma.siteSetting.findMany();
    const settingsMap = {};
    settings.forEach(s => {
      settingsMap[s.key] = JSON.parse(s.value);
    });
    res.json(settingsMap);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Get single setting
router.get('/:key', async (req, res) => {
  try {
    const setting = await req.prisma.siteSetting.findUnique({
      where: { key: req.params.key }
    });

    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    res.json({ key: setting.key, value: JSON.parse(setting.value) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
});

// Update setting (admin only)
router.put('/:key', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { value } = req.body;

    const setting = await req.prisma.siteSetting.upsert({
      where: { key: req.params.key },
      update: { value: JSON.stringify(value) },
      create: { key: req.params.key, value: JSON.stringify(value) }
    });

    res.json({ key: setting.key, value: JSON.parse(setting.value) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

export default router;
