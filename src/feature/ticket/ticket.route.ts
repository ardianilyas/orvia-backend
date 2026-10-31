import { Router } from "express";
import { TicketService } from "@/feature/ticket/ticket.service.ts";
import { TicketController } from "@/feature/ticket/ticket.controller.ts";
import { authMiddleware } from "@/shared/middlewares/auth.middleware.ts";
import { requireRole } from "@/shared/middlewares/require-role";

const router = Router();

const ticketService = new TicketService();
const ticketController = new TicketController(ticketService);

router.use(authMiddleware);
router.get("/", ticketController.getTicketsByAuthorId);
router.get("/:id", ticketController.getTicketById);
router.post("/", ticketController.createTicket);
router.patch("/:id", ticketController.updateTicket);
router.delete("/:id", ticketController.deleteTicket);

router.use(requireRole("admin"));
router.patch("/:id/assignee", ticketController.assignTicketToAgent);

export default router;
