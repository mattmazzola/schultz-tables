import { DataFunctionArgs, json } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import { auth, getSession } from "~/services/auth.server"
import * as models from '~/types/models'
import * as options from '~/utilities/options'
import * as utilities from '~/utilities'
import { GameType } from "~/components/GameType"
import React from "react"

type State = {
  isGameVisible: boolean
  isGameOptionsVisible: boolean
  gameTypes: models.IOption<models.ITableConfig>[]
  gameTypeIdSelected: string
  signedStartTime: string | null
  table: models.ITable
  gameState: models.IGameState
}

const tableConfig = utilities.generateTableConfig()
const sequence = utilities.generateSymbols(tableConfig)
const table = utilities.generateTable(tableConfig, sequence)

const initialState: State = {
  isGameVisible: false,
  isGameOptionsVisible: false,
  gameTypes: options.presetTables,
  gameTypeIdSelected: options.presetTables[0].id,
  signedStartTime: null,
  table,
  gameState: utilities.generateDefaultGameState()
}

type LoaderError = { message: string } | null

export const loader = async ({ request }: DataFunctionArgs) => {
  const profile = await auth.isAuthenticated(request)
  const session = await getSession(request.headers.get("Cookie"))
  const error = session.get(auth.sessionErrorKey) as LoaderError

  return json({
    profile,
    error,
    state: initialState,
  })
}

const playBuzzerSound = () => {
  const audio = new AudioContext()
  const gainNode = audio.createGain()
  gainNode.gain.value = 0.5

  const oscillator = audio.createOscillator()
  oscillator.type = 'sine'
  oscillator.frequency.value = 600
  oscillator
    .connect(gainNode)
    .connect(audio.destination)

  oscillator.start(0)

  setTimeout(() => {
    oscillator.stop()
  }, 150)
}

export default function Index() {
  const { profile, error, state } = useLoaderData<typeof loader>()

  const hasProfile = profile !== null && typeof profile === 'object'

  const [isUsingMobileDevice, setIsUsingMobileDevice] = React.useState(false)
  React.useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent)
    setIsUsingMobileDevice(isMobile)
  }, [])

  const onClickStart = async (gameType: models.IOption<models.ITableConfig>) => {
    console.log({ gameType })
  }

  return (
    <div>
      <div className="home-page" >
        {state.isGameVisible === false
          && <>
            <div>
              <h2>What is it?</h2>
              <p>Game to develop use of peripheral vision. Use soft focus to become aware of larger area.</p>
              <h2>How to play?</h2>
              <p>
                Click the symbols in sequence. Numbers 1,2,3... or Letters A,B,C... <br />
                Games differ by size, symbols, and visual effects.<br />
                <b>Try to complete the table as fast as you can!</b>
              </p>
              {isUsingMobileDevice === true
                && <>
                  <h2>Incompatible Device Detected.</h2>
                  <p>
                    You might be using a mobile device with small screen. This would not push peripheral vision boundaries and would be cheating. Try using a different device with larger screen.<br />
                    User Agent: {navigator.userAgent}
                  </p>
                </>
              }
            </div>
            {hasProfile
              ? <div>
                <div>Loggin as {profile?.displayName}</div>
              </div>
              : (
                <Form method="post" action="/auth">
                  {error ? <div>{error.message}</div> : null}
                  <p>
                    <button type="submit" className="login orangeButton">Sign In</button>
                  </p>
                  <div>You must sign in before you play the game!</div>
                </Form>
              )}
            {isUsingMobileDevice === false
              && <>
                <h1>Pick a game type below:</h1>

                <div className="game-types">
                  {state.gameTypes.map(gameType =>
                    <GameType
                      key={gameType.id}
                      gameType={gameType}
                      onClick={() => onClickStart(gameType)}
                    />)}
                </div>
              </>
            }
          </>
        }



        {state.isGameVisible
          && (
            <div className="game-container">
              TODO
            </div>
          )
        }
      </div>
    </div>
  )
}
