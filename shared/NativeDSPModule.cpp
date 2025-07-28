#include "NativeDSPModule.h"

#include <cmath>

namespace facebook::react {

NativeDSPModule::NativeDSPModule(std::shared_ptr<CallInvoker> jsInvoker)
    : NativeDSPModuleCxxSpec(std::move(jsInvoker)), yinInstance(nullptr) {}

NativeDSPModule::~NativeDSPModule() {
  // Ensure cleanup of Yin instance
  yinInstance.reset();
}

float NativeDSPModule::pitch(jsi::Runtime& rt, const std::vector<float>& input,
                             float sampleRate, float minFreq, float maxFreq,
                             float threshold) {
  // Validate input parameters
  if (input.empty() || sampleRate <= 0 || minFreq <= 0 || maxFreq <= 0 || threshold <= 0) {
    return -1.0f;
  }

  // (re)initialize yinInstance only when necessary
  if (!yinInstance || yinInstance->getBufferSize() != input.size() ||
      std::abs(yinInstance->getSampleRate() - sampleRate) > 1.0f) {
    try {
      yinInstance = std::make_unique<Yin>(sampleRate, input.size());

      // Log on each initialization
      std::string message = string_format(
          "Creating YIN instance @%.2fHz | buffer size: %d",
          yinInstance->getSampleRate(), yinInstance->getBufferSize());
      log(rt, message);
    } catch (const std::exception& e) {
      std::string error_msg = string_format("Failed to create YIN instance: %s", e.what());
      log(rt, error_msg);
      return -1.0f;
    }
  }

  try {
    auto pitch = yinInstance->getPitch(input, rt, minFreq, maxFreq, threshold);

    // Log pitch probability
    // auto prob_msg = string_format("Prob: %.2f", yinInstance->getProbability());
    // log(rt, prob_msg);

    return pitch;
  } catch (const std::exception& e) {
    std::string error_msg = string_format("Error in pitch detection: %s", e.what());
    log(rt, error_msg);
    return -1.0f;
  }
}

float NativeDSPModule::rms(jsi::Runtime& rt, const std::vector<float>& input) {
  if (input.empty()) {
    return 0.0f;
  }

  try {
    double sumSquares = 0.0;
    for (float value : input) {
      sumSquares += value * value;
    }
    return static_cast<float>(std::sqrt(sumSquares / input.size()));
  } catch (const std::exception& e) {
    std::string error_msg = string_format("Error in RMS calculation: %s", e.what());
    log(rt, error_msg);
    return 0.0f;
  }
}

}  // namespace facebook::react