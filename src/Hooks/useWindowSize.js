import { useEffect, useState } from "react";

function useWindowSize() {
    const [windowsize, setWindowSize] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    });

    useEffect(function () {
        function handlwWindowSize() {
            setWindowSize({
                height: window.innerHeight,
                width: window.innerWidth
            });
        }
        window.addEventListener("resize", handlwWindowSize);
        return () => {
            window.addEventListener("resize", handlwWindowSize);
        }
    }, []);

    return windowsize;
}

export default useWindowSize;