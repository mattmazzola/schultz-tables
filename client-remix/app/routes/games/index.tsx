import { SignedIn, SignedOut, useUser } from "@clerk/remix"
import { DataFunctionArgs, json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import React from "react"
import { GameType } from "~/components/GameType"
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

export const loader = async ({ request }: DataFunctionArgs) => {
    return json({
        state: initialState,
    })
}

export default function Index() {
    const { state } = useLoaderData<typeof loader>()
    const { user } = useUser()
    const [isUsingMobileDevice, setIsUsingMobileDevice] = React.useState(false)
    // Must be in useEffect because window.navigator is not on server
    React.useEffect(() => {
        const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent)
        setIsUsingMobileDevice(isMobile)
    }, [])

    return (
        <>
            <h1>What is it?</h1>
            <p>Schultz Tables is a game to develop the use of peripheral vision. Use soft focus to become aware of larger area.</p>
            <h1>How to play?</h1>
            <p>
                Symbols are randomly placed in a grid or table. You must click the symbols in sequence.<br />
                Numbers 1,2,3... or Letters A,B,C...<br />
                Tables differ by size, symbols, and visual effects.<br />
                <b>Try to complete the table as fast as you can!</b>
            </p>
            <h2>Restrictions / Recommended Setup</h2>
            <p>Please play the game on a large desktop monitor with your eyes at least 2 ft. from the screen. The smaller the screen, such as a mobile device, the more of the board you can see within the focus area of your eye. This means you do not have to use your peripheral vision and have an advantage.</p>
            {isUsingMobileDevice === true
                && <>
                    <h2>⚠️ Incompatible Device Detected!</h2>
                    <p>
                        You might be using a mobile device with small screen. Smaller screens give an unfair advantage and is considered a type of cheating. Try using a different device with larger screen.<br />
                        User Agent: {navigator.userAgent}
                    </p>
                </>}
            <SignedIn>
                    <h3>Current User: <Link to={`/users/${user?.id}`}>{user?.username ?? user?.emailAddresses.map(e => e.emailAddress).join(', ') ?? user?.id ?? 'Unknown User!'}</Link></h3>
            </SignedIn>
            <SignedOut>

                    <div className="center">
                          <Link to="/sign-in" className="logInButton">Sign In</Link>
                    </div>
                    <div>You must sign in before you play the game!</div>
            </SignedOut>
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
