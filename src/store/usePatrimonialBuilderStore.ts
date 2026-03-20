import { create } from "zustand";
import { CaseProfile } from "../types/case";
import { OutputDocument } from "../types/output";
import { Recommendation } from "../types/recommendation";
import { Risk } from "../types/risk";
import { EntryMode, ModuleId } from "../types/enums";
import { clauses } from "../data/clauses";
import { risks as initialRisks } from "../data/risks";
import { buildRecommendations } from "../lib/recommendationEngine";
import { recalculateRisks } from "../lib/riskEngine";
import { generateOutput } from "../lib/outputEngine";

export interface PatrimonialBuilderState {
  caseProfile: CaseProfile | null;
  answers: Record<string, string>;
  activeClauseIds: string[];
  recommendations: Recommendation[];
  risks: Risk[];
  alerts: string[];
  completedQuestionIds: string[];
  output: OutputDocument | null;

  setCaseProfile: (profile: CaseProfile) => void;
  answerQuestion: (questionId: string, answerValue: string) => void;
  setInitialEntrySelection: (moduleId: ModuleId, entryMode: EntryMode) => void;
  recalculateAll: () => void;
  generateOutput: () => void;
  resetCase: () => void;
}

export const usePatrimonialBuilderStore = create<PatrimonialBuilderState>((set, get) => ({
  caseProfile: null,
  answers: {},
  activeClauseIds: [],
  recommendations: [],
  risks: initialRisks,
  alerts: [],
  completedQuestionIds: [],
  output: null,

  setCaseProfile: (profile) => {
    set({ caseProfile: profile });
    // Auto-recalculate
    setTimeout(() => get().recalculateAll(), 0);
  },

  answerQuestion: (questionId, answerValue) => {
    const state = get();
    const newAnswers = { ...state.answers, [questionId]: answerValue };
    const newCompleted = state.completedQuestionIds.includes(questionId)
      ? state.completedQuestionIds
      : [...state.completedQuestionIds, questionId];

    set({ answers: newAnswers, completedQuestionIds: newCompleted });
    setTimeout(() => get().recalculateAll(), 0);
  },

  setInitialEntrySelection: (moduleId, entryMode) => {
    const state = get();
    if (state.caseProfile) {
      set({
        caseProfile: {
          ...state.caseProfile,
          selectedModule: moduleId,
          selectedEntryMode: entryMode,
        },
      });
    }
  },

  recalculateAll: () => {
    const state = get();
    if (!state.caseProfile) return;

    const { recommendations, alerts } = buildRecommendations(
      state.caseProfile,
      state.answers,
      clauses
    );

    const updatedRisks = recalculateRisks(
      initialRisks,
      recommendations,
      clauses,
      state.caseProfile
    );

    set({
      recommendations,
      risks: updatedRisks,
      alerts,
      activeClauseIds: recommendations.map(r => r.clauseId),
    });
  },

  generateOutput: () => {
    const state = get();
    if (!state.caseProfile) return;

    const output = generateOutput(
      state.caseProfile,
      state.recommendations,
      state.risks,
      clauses
    );

    set({ output });
  },

  resetCase: () => {
    set({
      caseProfile: null,
      answers: {},
      activeClauseIds: [],
      recommendations: [],
      risks: initialRisks,
      alerts: [],
      completedQuestionIds: [],
      output: null,
    });
  },
}));
