import { Router } from "express";
import { TicketService } from "@/feature/ticket/ticket.service.ts";
import { TicketController } from "@/feature/ticket/ticket.controller.ts";
import { authMiddleware } from "@/shared/middlewares/auth.middleware.ts";

const router = Router();

const ticketService = new TicketService();
const ticketController = new TicketController(ticketService);

router.use(authMiddleware);
router.get("/", ticketController.getTicketsByAuthorId);
router.get("/:id", ticketController.getTicketById);
router.post("/", ticketController.createTicket);
router.patch("/:id", ticketController.updateTicket);
router.delete("/:id", ticketController.deleteTicket);

export default router;
