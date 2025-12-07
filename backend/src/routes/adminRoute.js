import express from 'express'
import { protectedRoute } from '../middlewares/authMiddleware.js'
import * as adminController from '../controllers/adminController.js'

const router = express.Router()

router.get('/dashboard-stats', protectedRoute, adminController.getDashboardStats)
router.get('/reviews', protectedRoute, adminController.getReviews)
router.get('/resources', protectedRoute, adminController.getResources)
router.get('/tutor-approvals', protectedRoute, adminController.getTutorApprovals)
router.put('/tutor-approvals/:id', protectedRoute, adminController.updateTutorApprovalStatus)

export default router
