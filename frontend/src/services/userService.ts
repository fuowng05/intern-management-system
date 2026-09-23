import api from "../api/axios";
import type { MentorResponse } from "../types/user";

const userService = {
  async getMentors(
    companyId?: string
  ): Promise<MentorResponse[]> {
    const response =
      await api.get<MentorResponse[]>(
        "/Users/mentors",
        {
          params: companyId
            ? { companyId }
            : undefined,
        }
      );

    return response.data;
  },
};

export default userService;