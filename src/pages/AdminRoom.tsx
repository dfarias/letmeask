import { useHistory, useParams } from 'react-router-dom'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

import '../styles/room.scss'
import { Question } from '../components/Question'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'

type RoomParams = {
  id: string
}

export function AdminRoom() {
  const history = useHistory()
  const params = useParams<RoomParams>()
  const roomId = params.id
  const { title, questions } = useRoom(roomId)

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({ closedAt: new Date() })
    history.push('/')
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  async function handleCheckQuestion(questionId: string) {
    console.log('handleCheckQuestion')
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({isAnswered: true})
  }

  async function handleAnswerQuestion(questionId: string) {
    console.log('handleAnswerQuestion')
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({isHighlighted: true})
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1>{title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
        </div>

        <div className="question-list">
          {questions.map(question => {
            return (
              <Question 
                  key={question.id}
                  content={question.content}
                  author={question.author}
                  isHighlighted={question.isHighlighted}
                  isAnswered={question.isAnswered}>
                { !question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestion(question.id)}
                    >
                      <img src={checkImg} alt="Destacar perguntar" />
                    </button>
                    <button
                        type="button"
                        onClick={() => handleAnswerQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Responder perguntar" />
                    </button>
                  </>
                )}
                <button
                    type="button"
                    onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover perguntar" />
                </button>
              </Question>
            )
          })}
        </div>

      </main>
    </div>
  )
}