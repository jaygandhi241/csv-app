import { Router } from 'express';
import { authenticateJWT } from '../services/security.js';
import { downloadRecords, getRecords } from '../controller/recordController.js';

const router = Router();

router.get('/', authenticateJWT, getRecords)
router.get('/download', authenticateJWT, downloadRecords)

export default router;

