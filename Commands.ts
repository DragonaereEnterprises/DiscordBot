import { Command } from "./types";
import { DiceRoll } from "./commands/fun/diceroll";
import { CoinFlip } from "./commands/fun/coinflip";
import { CheckNSFW } from "./commands/admin/checknsfw";
import { Purge } from "./commands/moderation/purge";
import { ShutDown } from "./commands/botowner/shutdown";
import { EightBall } from "./commands/fun/8ball";
import { Help } from "./commands/other/help";
import { Play } from "./commands/music/play";
import { Stop } from "./commands/music/stop";
import { Volume } from "./commands/music/volume";
import { Loop } from "./commands/music/loop";
import { Skip } from "./commands/music/skip";
import { Equalizer } from "./commands/music/equalizer";
import { Filters } from "./commands/music/filters";

export const Commands: Command[] = [DiceRoll, CoinFlip, CheckNSFW, Purge, ShutDown, EightBall, Help, Play, Stop, Volume, Loop, Skip, Equalizer, Filters];