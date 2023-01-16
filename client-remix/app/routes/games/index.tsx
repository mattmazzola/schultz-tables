import { DataFunctionArgs, json } from "@remix-run/node"
import { Form, Link, useLoaderData } from "@remix-run/react"
import React from "react"
import { GameType } from "~/components/GameType"
import { auth, getSession } from "~/services/auth.server"
import * as models from '~/types/models'
import * as utilities from '~/utilities'
import * as options from '~/utilities/options'

type State = {
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

export default function Index() {
    const { profile, error, state } = useLoaderData<typeof loader>()

    const hasProfile = profile !== null && typeof profile === 'object'

    const [isUsingMobileDevice, setIsUsingMobileDevice] = React.useState(false)
    // Must be in useEffect because window.navigator is not on server
    React.useEffect(() => {
        const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent)
        setIsUsingMobileDevice(isMobile)
    }, [])

    return (
        <>
            <h1>What is it?</h1>
            <p>Game to develop use of peripheral vision. Use soft focus to become aware of larger area.</p>
            <h1>How to play?</h1>
            <p>
                Click the symbols in sequence. Numbers 1,2,3... or Letters A,B,C... <br />
                Games differ by size, symbols, and visual effects.<br />
                <b>Try to complete the table as fast as you can!</b>
            </p>
            <h2>Restrictions / Recommended Setup</h2>
            <p>Please play the game on a large desktop monitor with your eyes at 2 ft. from the screen. The smaller the screenm, such as a mobile device, the more of the board you can fit under the focus area of your eye and in this case you are forced to train peripheral vision.</p>
            {isUsingMobileDevice === true
                && <>
                    <h2>⚠️ Incompatible Device Detected!</h2>
                    <p>
                        You might be using a mobile device with small screen. This would not push peripheral vision boundaries and is a type of cheating since it offers advantage. Try using a different device with larger screen.<br />
                        User Agent: {navigator.userAgent}
                    </p>
                </>}
            {hasProfile
                ? <>
                    <h3>Current User: <Link to={`/users/${profile.id}`}>{profile?.displayName}</Link></h3>
                </>
                : <>
                    {error ? <div>{error.message}</div> : null}
                    <div className="center">
                        <Form method="post" action="/auth">
                            <button type="submit" className="logInButton">Sign In</button>
                        </Form>
                    </div>
                    <div>You must sign in before you play the game!</div>
                </>}
            <div className="home-page">
                {isUsingMobileDevice === false
                    && <>
                        <h1>Pick a game type below:</h1>

                        <div className="game-types">
                            {state.gameTypes.map(gameType =>
                                <Link
                                    key={gameType.id}
                                    to={`/games/${gameType.id}`}
                                >
                                    <GameType
                                        gameType={gameType}
                                    />
                                </Link>)}
                        </div>
                    </>}
            </div>
        </>

    )
}
