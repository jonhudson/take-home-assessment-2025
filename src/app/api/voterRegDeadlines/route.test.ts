import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { GET } from "./route";

vi.mock("@/lib/db", () => {
  const mockFindAll = vi.fn();
  return {
    getVoterRegistrationDeadline: vi.fn(() => ({
      findAll: mockFindAll,
    })),
  };
});

const toModelInstance = (data: object) => ({
  get: () => data,
});

import { getVoterRegistrationDeadline } from "@/lib/db";
import { Op } from "sequelize";

const mockData = [
  {
    State: "Alabama",
    DeadlineInPerson: "2018-10-22",
    DeadlineByMail: "2018-10-22",
    DeadlineOnline: "2018-10-22",
    ElectionDayRegistration: "",
    OnlineRegistrationLink:
      "https://web.archive.org/web/20190209174006/https://www.alabamavotes.gov/olvr/default.aspx",
    Description: "Postmarked or submitted 15 days before the election.",
  },
];

afterEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/voterRegDeadlines", () => {
  it("returns deadlines", async () => {
    const mockModel = getVoterRegistrationDeadline();
    vi.mocked(mockModel.findAll).mockResolvedValue(
      mockData.map(toModelInstance) as any,
    );

    const req = new Request(
      "http://localhost:3000/api/voterRegDeadlines?sortCol=state&sortDir=asc",
    );
    const res = await GET(req);
    const json = await res.json();

    const expectedDtos = [
      {
        state: "Alabama",
        deadlineInPerson: "2018-10-22",
        deadlineByMail: "2018-10-22",
        deadlineOnline: "2018-10-22",
        electionDayRegistration: "",
        onlineRegistrationLink:
          "https://web.archive.org/web/20190209174006/https://www.alabamavotes.gov/olvr/default.aspx",
        description: "Postmarked or submitted 15 days before the election.",
      },
    ];

    expect(res.status).toBe(200);
    expect(mockModel.findAll).toHaveBeenCalledOnce();
    expect(json).toEqual(expectedDtos);
  });
});

describe("GET /api/voterRegDeadlines", () => {
  it("sets sort and filter on model query", async () => {
    const mockModel = getVoterRegistrationDeadline();
    vi.mocked(mockModel.findAll).mockResolvedValue(
      mockData.map(toModelInstance) as any,
    );

    const req = new Request(
      "http://localhost:3000/api/voterRegDeadlines?sortCol=state&sortDir=asc&state=Al",
    );
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(mockModel.findAll).toHaveBeenCalledOnce();
    expect(mockModel.findAll).toHaveBeenCalledWith({
      where: {
        State: {
          [Op.iLike]: "%Al%",
        },
      },
      order: [["State", "asc"]],
    });
  });
});
