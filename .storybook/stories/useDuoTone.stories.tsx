import * as React from "react";
import type { StoryObj } from "@storybook/react";
import { setArgTypes } from "../utils/setArgTypes";
import { Setup } from "../utils/Setup";
import type { Meta } from "@storybook/react";
import { UseDuoTone } from "./UseDuoTone";
import {
   DuoToneInitialParams,
   DuoToneParams,
} from "../../packages/use-shader-fx/src/hooks/useDuoTone";

const meta = {
   title: "useDuoTone",
   component: UseDuoTone,
   tags: ["autodocs"],
   decorators: [(storyFn: any) => <Setup>{storyFn()}</Setup>],
} satisfies Meta<typeof UseDuoTone>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
   args: DuoToneInitialParams,
   argTypes: setArgTypes<DuoToneParams>(DuoToneInitialParams),
};
