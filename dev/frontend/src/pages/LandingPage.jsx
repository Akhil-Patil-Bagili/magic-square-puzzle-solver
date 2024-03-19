import {LandingBar} from "../components/LandingBar";
import {HeroHeading} from "../components/HeroHeading";
import {HeroSubHeading} from "../components/HeroSubHeading";
import {ButtonDark} from "../components/ButtonDark";
import HeroImage from "../assets/HeroImage.png";

export const LandingPage = () => {
    return <div>
        <LandingBar/>
        <section className="bg-white dark:bg-gray-900">
            <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
                <div className="mr-auto place-self-center lg:col-span-7">
                    <HeroHeading label="Discover the Magic of Numbers"/>
                    <HeroSubHeading label="craft your square, cast your spell!"/>
                    <ButtonDark label="Get Started"/>
                </div>  
                <div className="hidden lg:mt-4 lg:col-span-3 lg:flex">
                    <img src={HeroImage} alt="mockup"/>
                </div>                     
            </div>
        </section>
    </div>
} 