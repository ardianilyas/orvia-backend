export const TICKET_VALIDATION_MESSAGE = {
  ID_REQUIRED: "Ticket ID is required and must be valid uuid format",
  CATEGORY_REQUIRED: "Category is required",
  TITLE_REQUIRED: "Title is required",
  TITLE_MIN: (length: number) => `Title must be at least ${length} characters long`,
  TITLE_MAX: (length: number) => `Title must be at most ${length} characters long`,
  DESCRIPTION_REQUIRED: "Description is required",
  DESCRIPTION_MIN: (length: number) => `Description must be at least ${length} characters long`,
  DESCRIPTION_MAX: (length: number) => `Description must be at most ${length} characters long`,
}

export const TICKET_SUCCESS_MESSAGE = {
  GET_TICKETS: "Tickets fetched successfully",
  GET_TICKET: "Ticket fetched successfully",
  CREATE_TICKET: "Ticket created successfully",
  UPDATE_TICKET: "Ticket updated successfully",
  ASSIGN_TICKET_TO_AGENT: "Ticket assigned to agent",
}

const TICKET_BASE_URL = "/api/tickets";

export const TICKET_TEST_ROUTE = {
  GET_TICKETS: TICKET_BASE_URL,
  GET_TICKET: (id: string) => `${TICKET_BASE_URL}/${id}`,
  CREATE_TICKET: TICKET_BASE_URL,
  UPDATE_TICKET: (id: string) => `${TICKET_BASE_URL}/${id}`,
  ASSIGN_TICKET_TO_AGENT: (id: string) => `${TICKET_BASE_URL}/${id}/assignee`,
  DELETE_TICKET: (id: string) => `${TICKET_BASE_URL}/${id}`,
}

export const TICKET_NOT_FOUND = "Ticket not found";