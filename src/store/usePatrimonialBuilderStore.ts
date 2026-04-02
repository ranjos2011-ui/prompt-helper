import { create } from "zustand";
import { CaseProfile } from "../types/case";
import { OutputDocument } from "../types/output";
import { Recommendation } from "../types/recommendation";
import { Risk } from "../types/risk";
import { ClauseDraftState } from "../types/clauseBuilder";
import { EntryMode, ModuleId } from "../types/enums";
import { clauses } from "../data/clauses";
import { risks as initialRisks } from "../data/risks";
import { buildRecommendations } from "../lib/recommendationEngine";
import { recalculateRisks } from "../lib/riskEngine";
import { generateOutput } from "../lib/outputEngine";
import { clauseDetailConfigs } from "../data/clauseDetails";
import { computeActivatedBlocks, generateDraftPreview, computeCustomAlerts } from "../lib/clauseDraftEngine";

export interface PatrimonialBuilderState {
  caseProfile: CaseProfile | null;
  answers: Record<string, string>;
  questionNotes: Record<string, string>;
  generalInterviewNotes: string;
  clientQualification: string;
  activeClauseIds: string[];
  recommendations: Recommendation[];
  risks: Risk[];
  alerts: string[];
  completedQuestionIds: string[];
  output: OutputDocument | null;
  clauseDraftStates: Record<string, ClauseDraftState>;

  setCaseProfile: (profile: CaseProfile) => void;
  answerQuestion: (questionId: string, answerValue: string) => void;
  saveQuestionNotes: (questionId: string, notes: string) => void;
  setGeneralInterviewNotes: (notes: string) => void;
  setClientQualification: (text: string) => void;
  setInitialEntrySelection: (moduleId: ModuleId, entryMode: EntryMode) => void;
  recalculateAll: () => void;
  generateOutput: () => void;
  resetCase: () => void;
  answerClauseDecisionQuestion: (clauseId: string, questionId: string, value: string) => void;
  selectClauseTemplate: (clauseId: string, templateId: string) => void;
  toggleClauseComplementaryBlock: (clauseId: string, templateId: string) => void;
  saveClauseCustomization: (clauseId: string) => void;
}

export const usePatrimonialBuilderStore = create<PatrimonialBuilderState>((set, get) => ({
  caseProfile: null,
  answers: {},
  questionNotes: {},
  generalInterviewNotes: "",
  activeClauseIds: [],
  recommendations: [],
  risks: initialRisks,
  alerts: [],
  completedQuestionIds: [],
  output: null,
  clauseDraftStates: {},

  setCaseProfile: (profile) => {
    set({ caseProfile: profile });
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

  saveQuestionNotes: (questionId, notes) => {
    const state = get();
    set({ questionNotes: { ...state.questionNotes, [questionId]: notes } });
  },

  setGeneralInterviewNotes: (notes) => {
    set({ generalInterviewNotes: notes });
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
      questionNotes: {},
      generalInterviewNotes: "",
      activeClauseIds: [],
      recommendations: [],
      risks: initialRisks,
      alerts: [],
      completedQuestionIds: [],
      output: null,
      clauseDraftStates: {},
    });
  },

  answerClauseDecisionQuestion: (clauseId, questionId, value) => {
    const state = get();
    const existing = state.clauseDraftStates[clauseId] || {
      clauseId,
      answers: {},
      activatedDraftBlocks: [],
      selectedTemplateId: null,
      selectedComplementaryIds: [],
      customDocumentAllocation: null,
      customAlerts: [],
      draftPreview: "",
    };

    const newAnswers = { ...existing.answers, [questionId]: value };
    const config = clauseDetailConfigs[clauseId];

    let activatedDraftBlocks = existing.activatedDraftBlocks;
    let draftPreview = existing.draftPreview;
    let customAlerts = existing.customAlerts;

    if (config) {
      activatedDraftBlocks = computeActivatedBlocks(config, newAnswers);
      draftPreview = generateDraftPreview(config, activatedDraftBlocks);
      customAlerts = computeCustomAlerts(config, newAnswers);
    }

    set({
      clauseDraftStates: {
        ...state.clauseDraftStates,
        [clauseId]: {
          ...existing,
          answers: newAnswers,
          activatedDraftBlocks,
          draftPreview,
          customAlerts,
        },
      },
    });
  },

  selectClauseTemplate: (clauseId, templateId) => {
    const state = get();
    const existing = state.clauseDraftStates[clauseId] || {
      clauseId, answers: {}, activatedDraftBlocks: [],
      selectedTemplateId: null, selectedComplementaryIds: [],
      customDocumentAllocation: null, customAlerts: [], draftPreview: "",
    };
    set({
      clauseDraftStates: {
        ...state.clauseDraftStates,
        [clauseId]: {
          ...existing,
          selectedTemplateId: existing.selectedTemplateId === templateId ? null : templateId,
        },
      },
    });
  },

  toggleClauseComplementaryBlock: (clauseId, templateId) => {
    const state = get();
    const existing = state.clauseDraftStates[clauseId] || {
      clauseId, answers: {}, activatedDraftBlocks: [],
      selectedTemplateId: null, selectedComplementaryIds: [],
      customDocumentAllocation: null, customAlerts: [], draftPreview: "",
    };
    const ids = existing.selectedComplementaryIds.includes(templateId)
      ? existing.selectedComplementaryIds.filter((id) => id !== templateId)
      : [...existing.selectedComplementaryIds, templateId];
    set({
      clauseDraftStates: {
        ...state.clauseDraftStates,
        [clauseId]: { ...existing, selectedComplementaryIds: ids },
      },
    });
  },

  saveClauseCustomization: (clauseId) => {
    const state = get();
    const draft = state.clauseDraftStates[clauseId];
    if (draft) {
      set({
        clauseDraftStates: {
          ...state.clauseDraftStates,
          [clauseId]: { ...draft },
        },
      });
    }
  },
}));
