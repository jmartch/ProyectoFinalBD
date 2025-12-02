// routes/CALENDAR.js
import express from 'express';
import {
  getCalendarEvents,
  getCalendarFiltersController,
} from '../controllers/CALENDAR.controller.js';

const router = express.Router();

// Eventos del calendario
router.get('/events', getCalendarEvents);

// Opciones de filtros para el calendario
router.get('/filters', getCalendarFiltersController);

export default router;
