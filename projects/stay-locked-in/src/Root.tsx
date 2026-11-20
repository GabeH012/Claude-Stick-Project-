import "./index.css";
import { Composition, Still } from "remotion";
import { STORY_SHOTS, STORY_TOTAL, Story, StorySampler, VStory, VStorySampler } from "./bean/Story";
import { VThumbA, VThumbB } from "./bean/Thumbs";
import { ThumbA, ThumbB } from "./bean/Thumbs";
import { CastSheet } from "./bean/CastSheet";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Story" component={Story} durationInFrames={Math.round(STORY_TOTAL * 30)} fps={30} width={1920} height={1080} />
      <Composition id="StorySampler" component={StorySampler} durationInFrames={STORY_SHOTS * 3} fps={30} width={1920} height={1080} />
      <Composition id="VStory" component={VStory} durationInFrames={Math.round(STORY_TOTAL * 30)} fps={30} width={1080} height={1920} />
      <Composition id="VStorySampler" component={VStorySampler} durationInFrames={STORY_SHOTS * 3} fps={30} width={1080} height={1920} />
      <Still id="VThumbA" component={VThumbA} width={1080} height={1920} />
      <Still id="VThumbB" component={VThumbB} width={1080} height={1920} />
      <Still id="ThumbA" component={ThumbA} width={1920} height={1080} />
      <Still id="ThumbB" component={ThumbB} width={1920} height={1080} />
      <Still id="CastSheet" component={CastSheet} width={1920} height={1080} />
    </>
  );
};
