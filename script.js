/**
 * Krishi AI – Smart Farming Assistant
 * Frontend JavaScript
 *
 * SECURITY NOTE:
 * All Gemini API calls are made exclusively from the Flask backend.
 * This file only communicates with our own /analyze endpoint.
 * No API keys are present or referenced here.
 */

(function () {
  "use strict";

  // ── DOM references ──────────────────────────────────────────────────────
  const symptomsInput  = document.getElementById("symptoms");
  const analyzeBtn     = document.getElementById("analyzeBtn");
  const charCount      = document.getElementById("charCount");
  const errorMsg       = document.getElementById("errorMsg");

  // Result overlay
  const resultOverlay  = document.getElementById("resultOverlay");
  const closeResult    = document.getElementById("closeResult");
  const newAnalysis    = document.getElementById("newAnalysis");
  const printResult    = document.getElementById("printResult");
  const resultSummary  = document.getElementById("resultSummary");

  // Result fields
  const resDisease     = document.getElementById("resDisease");
  const resCause       = document.getElementById("resCause");
  const resTreatment   = document.getElementById("resTreatment");
  const resPrevention  = document.getElementById("resPrevention");

  // ── Character counter ───────────────────────────────────────────────────
  symptomsInput.addEventListener("input", () => {
    const len = symptomsInput.value.length;
    charCount.textContent = len;
    charCount.style.color = len > 1800 ? "#e05c5c" : "";
    if (len > 0) clearError();
  });

  // ── Analyze button ──────────────────────────────────────────────────────
  analyzeBtn.addEventListener("click", handleAnalyze);

  // Allow Ctrl+Enter to submit
  symptomsInput.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleAnalyze();
  });

  async function handleAnalyze() {
    const symptoms = symptomsInput.value.trim();

    // Client-side validation (mirrors server-side)
    if (!symptoms) {
      showError("Please describe the crop symptoms before analyzing.");
      symptomsInput.focus();
      return;
    }
    if (symptoms.length < 10) {
      showError("Please provide a bit more detail about the symptoms.");
      symptomsInput.focus();
      return;
    }

    setLoading(true);
    clearError();

    try {
      // POST to our Flask backend — NOT directly to Gemini
      const response = await fetch("/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || "Analysis failed. Please try again.");
      }

      showResult(json.data, symptoms);

    } catch (err) {
      showError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Show result overlay ─────────────────────────────────────────────────
  function showResult(data, symptoms) {
    // Populate result cards
    resDisease.textContent    = data.disease    || "Could not determine";
    resCause.textContent      = data.cause      || "Not identified";
    resTreatment.textContent  = data.treatment  || "Consult a local agronomist";
    resPrevention.textContent = data.prevention || "Consult a local agronomist";

    // Summary line
    resultSummary.textContent =
      `Based on: "${truncate(symptoms, 80)}"`;

    // Show overlay
    resultOverlay.hidden = false;
    document.body.style.overflow = "hidden";

    // Scroll overlay to top
    resultOverlay.scrollTop = 0;
  }

  // ── Close result overlay ────────────────────────────────────────────────
  function closeOverlay() {
    resultOverlay.hidden = true;
    document.body.style.overflow = "";
  }

  closeResult.addEventListener("click", closeOverlay);
  newAnalysis.addEventListener("click", () => {
    closeOverlay();
    symptomsInput.value = "";
    charCount.textContent = "0";
    symptomsInput.focus();
  });

  // Close on backdrop click
  resultOverlay.addEventListener("click", (e) => {
    if (e.target === resultOverlay) closeOverlay();
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !resultOverlay.hidden) closeOverlay();
  });

  // Print / save
  printResult.addEventListener("click", () => window.print());

  // ── Loading state ───────────────────────────────────────────────────────
  function setLoading(isLoading) {
    const btnText    = analyzeBtn.querySelector(".btn-text");
    const btnLoading = analyzeBtn.querySelector(".btn-loading");

    analyzeBtn.disabled = isLoading;
    btnText.hidden      = isLoading;
    btnLoading.hidden   = !isLoading;
  }

  // ── Error helpers ───────────────────────────────────────────────────────
  function showError(msg) {
    errorMsg.textContent = "⚠️ " + msg;
    errorMsg.classList.add("visible");
  }

  function clearError() {
    errorMsg.textContent = "";
    errorMsg.classList.remove("visible");
  }

  // ── Utility ─────────────────────────────────────────────────────────────
  function truncate(str, maxLen) {
    return str.length <= maxLen ? str : str.slice(0, maxLen) + "…";
  }

})();
