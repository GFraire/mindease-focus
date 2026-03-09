interface FinishFocusSessionRequest {
  sessionId: string
}

export class FinishFocusSessionUseCase {
  async execute({ sessionId }: FinishFocusSessionRequest) {

    return {
      finished: true
    }
  }
}