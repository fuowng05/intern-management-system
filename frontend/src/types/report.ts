export interface EvaluationResultReportResponse {
    evaluationId: string;
  
    studentCode: string;
    studentName: string;
  
    companyName: string;
  
    periodCode: string;
    periodName: string;
  
    mentorName: string;
  
    totalScore: number;
    classification: string;
    result: string;
  
    publishedAt: string | null;
  }