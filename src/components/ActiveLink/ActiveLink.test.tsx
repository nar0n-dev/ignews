import { render, screen } from '@testing-library/react'
import { ActiveLink } from '.'

jest.mock('next/router', () => {
    return {
        useRouter(){
            return {
                asPath: '/'
            }
        }
    }
})

describe('ActiveLink component', () => {
    test('Test A - active link renders correctly', () => {
        render (
            <ActiveLink href='/' activeClassName="active">
                <a>Home</a>
            </ActiveLink>
        )
    
        expect(screen.getByText('Home')).toBeInTheDocument();
    })
    
    test('Test B - active link is receiving active class', () => {
        render (
            <ActiveLink href='/' activeClassName="active">
                <a>Home</a>
            </ActiveLink>
        )
    
        expect(screen.getByText('Home')).toHaveClass('active');
    })
})

