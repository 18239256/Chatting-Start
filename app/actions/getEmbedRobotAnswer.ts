import axios from "axios";
import { OPENAIFastAPIKBParamType, OPENAIFastAPIParamType } from "../types";
import { Robot, RobotMask, RobotTemplate } from "@prisma/client";

const getEmbedRobotAnswer = async (
    robot: Robot & {robotTemp: RobotTemplate, mask: RobotMask},
    message: string,
) => {
    try {

        return {error: "作废函数"};

    } catch (error: any) {
        return "";
    }
};

export default getEmbedRobotAnswer;