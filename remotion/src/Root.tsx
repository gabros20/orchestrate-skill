import React from "react";
import { Composition } from "remotion";
import { z } from "zod";
import { LifeOfATask } from "./LifeOfATask";

const schema = z.object({
  theme: z.enum(["light", "dark"]),
});

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="life-of-a-task"
      component={LifeOfATask}
      schema={schema}
      defaultProps={{ theme: "light" as const }}
      durationInFrames={1440}
      fps={30}
      width={1200}
      height={520}
    />
  );
};
