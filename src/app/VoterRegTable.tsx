"use client";

import { Table, Link as ChakraLink, Box, Input, Stack } from "@chakra-ui/react";
import NextLink from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

type StateDeadline = {
  state: string;
  deadlineInPerson: string;
  deadlineByMail: string;
  deadlineOnline: string;
  electionDayRegistration: string;
  onlineRegistrationLink: string;
  description: string;
};

type Filter = {
  [K in keyof StateDeadline]?: string;
};

type SortDir = "asc" | "desc";

export const VoterRegTable = () => {
  const [deadlineData, setDeadlineData] = useState<StateDeadline[]>([]);
  const [sortCol, setSortCol] = useState<{
    name: keyof StateDeadline;
    dir: SortDir;
  }>({ name: "state", dir: "asc" });

  const [filter, setFilter] = useState<Filter>();

  const getDeadlineData = async (
    sortCol: keyof StateDeadline,
    sortDir: SortDir,
    filter: Filter,
  ) => {
    const params = new URLSearchParams({
      sortCol,
      sortDir,
      ...filter
    });
    const response = await fetch(`/api/voterRegDeadlines?${params}`);
    if (!response.ok) {
      console.error("failed to fetch deadline data");
    } else {
      const data = await response.json();
      setDeadlineData(data);
    }
  };

  useEffect(() => {
    getDeadlineData(sortCol.name, sortCol.dir, filter);
  }, [sortCol, filter]);

  const onHeaderClick = (name: keyof StateDeadline) => {
    const sortState = {
      name,
      dir: sortCol.dir === "desc" ? ("asc" as const) : ("desc" as const),
    };
    setSortCol(sortState);
  };

  const onFilterChange = (name: keyof StateDeadline, value: string) => {
    setFilter((filter) => ({
      ...filter,
      [name]: value,
    }));
  };

  return (
    <Table.Root style={{ tableLayout: "fixed" }} size="md" minW="768px" striped>
      <Table.Header height="100%">
        <Table.Row height="100%">
          {[
            ["State", "state"],
            ["In Person Deadline", "deadlineInPerson"],
            ["By Mail Deadline", "deadlineByMail"],
            ["Online Deadline", "deadlineOnline"],
            ["Election Day Registration", "electionDayRegistration"],
            ["Online Registration Link", "onlineRegistrationLink"],
            ["Description", "description"],
          ].map(([heading, colName]) => (
            <Table.ColumnHeader
              key={heading}
              width="calc(100% / 7)"
              fontWeight="bold"
              height="100%"
            >
              <Stack height="100%" justify="space-between">
                <Box
                  onClick={() => onHeaderClick(colName as keyof StateDeadline)}
                  cursor="pointer"
                >
                  {heading}&nbsp;
                  {sortCol.name === colName ? (
                    sortCol.dir === "asc" ? (
                      <span>{"\u25B2"}</span>
                    ) : (
                      <span>{"\u25BC"}</span>
                    )
                  ) : null}
                </Box>
                <Box>
                  <Input
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      onFilterChange(
                        colName as keyof StateDeadline,
                        e.target.value,
                      )
                    }
                  />
                </Box>
              </Stack>
            </Table.ColumnHeader>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {deadlineData.map((item) => (
          <Table.Row key={item.state}>
            {Object.keys(item).map((key) => (
              <Table.Cell key={key} width="calc(100% / 7)">
                {key === "onlineRegistrationLink" ? (
                  <ChakraLink asChild>
                    <NextLink href={item[key]}>Registration Link</NextLink>
                  </ChakraLink>
                ) : (
                  item[key]
                )}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};
