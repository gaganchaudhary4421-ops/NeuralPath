import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { TopicScene } from "./scenes/TopicScene";
import { CodeScene } from "./scenes/CodeScene";
import { SkillMapScene } from "./scenes/SkillMapScene";
import { OutroScene } from "./scenes/OutroScene";

// Duration constants (in frames at 30fps)
const INTRO_DURATION = 120; // 4s
const TOPIC_DURATION = 210; // 7s per topic
const CODE_DURATION = 180; // 6s per code scene
const SKILL_MAP_DURATION = 150; // 5s
const OUTRO_DURATION = 150; // 5s

/**
 * Build the flat sequence list from the video script.
 * Each item: { type, from, duration, props }
 */
function buildSequences(script) {
  const sequences = [];
  let cursor = 0;

  // 1. Intro
  sequences.push({
    type: "intro",
    from: cursor,
    duration: INTRO_DURATION,
    props: {
      pathTitle: script.pathTitle,
      learnerName: script.learnerName,
      domain: script.domain,
      difficulty: script.difficulty,
    },
  });
  cursor += INTRO_DURATION;

  // 2. For each step, alternate TopicScene → CodeScene (if available)
  const steps = script.steps || [];
  steps.forEach((step, i) => {
    // Topic scene
    sequences.push({
      type: "topic",
      from: cursor,
      duration: TOPIC_DURATION,
      props: {
        stepNumber: i + 1,
        totalSteps: steps.length,
        title: step.title,
        week: step.week,
        description: step.description,
        keyPoints: step.keyPoints || [],
        concepts: step.concepts || [],
        resources: step.resources || [],
      },
    });
    cursor += TOPIC_DURATION;

    // Code scene (if the step has a code example)
    if (step.codeExample) {
      sequences.push({
        type: "code",
        from: cursor,
        duration: CODE_DURATION,
        props: {
          topicTitle: step.title,
          language: step.codeExample.language || "JavaScript",
          codeLines: step.codeExample.lines || [],
          explanation: step.codeExample.explanation || "",
        },
      });
      cursor += CODE_DURATION;
    }
  });

  // 3. Skill map (after all steps)
  sequences.push({
    type: "skillmap",
    from: cursor,
    duration: SKILL_MAP_DURATION,
    props: {
      skillsGained: script.skillsGained || [],
      currentStepTitle: "Completing the Path",
    },
  });
  cursor += SKILL_MAP_DURATION;

  // 4. Outro
  sequences.push({
    type: "outro",
    from: cursor,
    duration: OUTRO_DURATION,
    props: {
      pathTitle: script.pathTitle,
      learnerName: script.learnerName,
      totalHours: script.totalHours,
      duration: script.duration,
      closingMessage: script.closingMessage,
    },
  });

  return { sequences, totalFrames: cursor + OUTRO_DURATION };
}

export function LearningVideo({ script }) {
  const { sequences } = buildSequences(script || {});

  return (
    <AbsoluteFill style={{ background: "#020f07" }}>
      {sequences.map((seq, idx) => (
        <Sequence key={idx} from={seq.from} durationInFrames={seq.duration}>
          <AbsoluteFill>
            {seq.type === "intro" && <IntroScene {...seq.props} />}
            {seq.type === "topic" && <TopicScene {...seq.props} />}
            {seq.type === "code" && <CodeScene {...seq.props} />}
            {seq.type === "skillmap" && <SkillMapScene {...seq.props} />}
            {seq.type === "outro" && <OutroScene {...seq.props} />}
          </AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}

export {
  buildSequences,
  INTRO_DURATION,
  TOPIC_DURATION,
  CODE_DURATION,
  SKILL_MAP_DURATION,
  OUTRO_DURATION,
};
