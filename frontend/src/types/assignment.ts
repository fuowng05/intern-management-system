export interface AssignmentResponse {
    id: string;
  
    applicationId: string;
  
    studentId: string;
    studentName: string;
    studentEmail: string;
  
    companyId: string;
    companyName: string;
  
    mentorId: string;
    mentorName: string;
    mentorEmail: string;
  
    assignedBy: string;
    assignedByName: string;
  
    assignedAt: string;
  }
  
  export interface CreateAssignmentRequest {
    applicationId: string;
    mentorId: string;
  }