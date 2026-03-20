import { ClauseDetailConfig, ClauseDraftState, DraftBlock } from "../types/clauseBuilder";

export function computeActivatedBlocks(
  config: ClauseDetailConfig,
  answers: Record<string, string>
): string[] {
  return config.draftBlocks
    .filter((block) => {
      if (block.activatedWhen.length === 0) return true; // always active
      return block.activatedWhen.some(
        (condition) => answers[condition.questionId] && condition.answerIn.includes(answers[condition.questionId])
      );
    })
    .map((b) => b.id);
}

export function generateDraftPreview(
  config: ClauseDetailConfig,
  activatedBlockIds: string[]
): string {
  return config.draftBlocks
    .filter((b) => activatedBlockIds.includes(b.id))
    .map((b) => b.text)
    .join("\n\n");
}

export function computeCustomAlerts(
  config: ClauseDetailConfig,
  answers: Record<string, string>
): string[] {
  const alerts: string[] = [];

  for (const q of config.decisionQuestions) {
    const answer = answers[q.id];
    if (q.alert && answer) {
      alerts.push(q.alert);
    }
    if (answer && q.impacts[answer]) {
      for (const impact of q.impacts[answer]) {
        if (impact.severity === "critical") {
          alerts.push(`${impact.description}`);
        }
      }
    }
  }

  // Dedup
  return [...new Set(alerts)];
}

export function getActiveBlocksByDocument(
  config: ClauseDetailConfig,
  activatedBlockIds: string[]
): Record<string, DraftBlock[]> {
  const result: Record<string, DraftBlock[]> = {};
  for (const block of config.draftBlocks) {
    if (!activatedBlockIds.includes(block.id)) continue;
    const doc = block.documentTarget;
    if (!result[doc]) result[doc] = [];
    result[doc].push(block);
  }
  return result;
}
