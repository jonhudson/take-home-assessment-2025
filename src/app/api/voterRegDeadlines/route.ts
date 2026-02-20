import { getVoterRegistrationDeadline } from "@/lib/db";
import { ucFirst } from "@/lib/util";
import { Op } from "sequelize";

type StateDeadline = {
  State: string;
  DeadlineInPerson: string;
  DeadlineByMail: string;
  DeadlineOnline: string;
  ElectionDayRegistration: string;
  OnlineRegistrationLink: string;
  Description: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const sortCol = ucFirst(searchParams.get("sortCol"));
  const sortDir = searchParams.get("sortDir");

  const filters = [...searchParams.entries()].filter(
    (entry) => !["sortCol", "sortDir"].includes(entry[0]),
  );

  const whereObj = {};
  filters.forEach((filter) => {
    if (filter[1].length) {
      whereObj[ucFirst(filter[0])] = {
        [Op.iLike]: `%${filter[1]}%`,
      };
    }
  });

  const VoterRegistrationDeadline = getVoterRegistrationDeadline();

  try {
    const stateDeadlines = await VoterRegistrationDeadline.findAll({
      where: whereObj,
      order: [[sortCol, sortDir]],
    });

    const dtos = stateDeadlines.map((row) => {
      const data = row.get() as StateDeadline;
      return {
        state: data.State,
        deadlineInPerson: data.DeadlineInPerson,
        deadlineByMail: data.DeadlineByMail,
        deadlineOnline: data.DeadlineOnline,
        electionDayRegistration: data.ElectionDayRegistration,
        onlineRegistrationLink: data.OnlineRegistrationLink,
        description: data.Description,
      };
    });
    return Response.json(dtos);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
