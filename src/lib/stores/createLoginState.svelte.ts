
function createLoginState() {
  let isProcessing = $state(false);

	return {
    get isProcessing() {
      return isProcessing;
    },
    start: () => (isProcessing = true),
    finish: () => (isProcessing = false),
  };
}

export const loginState = createLoginState();
