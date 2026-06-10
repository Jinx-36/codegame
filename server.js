import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient({});
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/save-session', async (req, res) => {
  try {
    const { matricule, name, maxLevel, timeUsed } = req.body;

    if (!matricule || !name || maxLevel === undefined || timeUsed === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const session = await prisma.session.create({
      data: {
        matricule,
        name,
        maxLevel,
        timeUsed
      }
    });

    res.status(201).json({ success: true, session });
  } catch (error) {
    console.error('Failed to save session:', error);
    res.status(500).json({ error: 'Failed to save session' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
