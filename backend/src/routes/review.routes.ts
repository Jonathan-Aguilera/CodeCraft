import { Router } from 'express';
import * as reviewController from '../controllers/review.controller';
import * as reviewValidator from '../validators/review.validator';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

// Consultas
router.get(
  '/',
  reviewValidator.reportedQueryValidator,
  validate,
  reviewController.getAllReviews
);
router.get(
  '/author/:userUid',
  reviewValidator.authorQueryValidator,
  validate,
  reviewController.getReviewsByAuthor
);
router.get(
  '/target/:targetUid',
  reviewValidator.targetQueryValidator,
  validate,
  reviewController.getReviewsByTarget
);
router.get(
  '/project/:projectId',
  reviewValidator.projectQueryValidator,
  validate,
  reviewController.getReviewsByProject
);
router.get(
  '/reported',
  reviewValidator.reportedQueryValidator,
  validate,
  reviewController.getReportedReviews
);
router.get(
  '/rating/:targetUid',
  reviewValidator.ratingQueryValidator,
  validate,
  reviewController.getAverageRating
);
router.get(
  '/:id',
  reviewValidator.idParamValidator,
  validate,
  reviewController.getReviewById
);

// Operaciones
router.post(
  '/',
  reviewValidator.createReviewValidator,
  validate,
  reviewController.createReview
);
router.put(
  '/:id',
  reviewValidator.updateReviewValidator,
  validate,
  reviewController.updateReview
);
router.delete(
  '/:id',
  reviewValidator.deleteReviewValidator,
  validate,
  reviewController.deleteReview
);
router.put(
  '/:id/report',
  reviewValidator.reportReviewValidator,
  validate,
  reviewController.reportReview
);

export default router;