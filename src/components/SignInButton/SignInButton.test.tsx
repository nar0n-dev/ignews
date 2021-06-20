import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { useSession } from 'next-auth/client'
import { SignInButton } from '.'

jest.mock('next-auth/client')

describe('SignInButton component', () => {
    test('Test A - renders correctly when user is NOT authenticated', () => {
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce([null, false])

        render (
            <SignInButton />
        )
    
        expect(screen.getByText('Sign in with GitHub')).toBeInTheDocument();
    })
    
    test('Test B - renders correctly when user is authenticated', () => {

        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValue([
            {
                user: {
                    name: 'John Doe', 
                    email: 'john.doe@gmail.com'
                },
                expires: 'fake-expires', 
            },
            false
        ])

        render (
            <SignInButton />
        )
    
        expect(screen.getByText('John Doe')).toBeInTheDocument();
    })
})

