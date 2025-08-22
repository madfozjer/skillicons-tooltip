import { useState, useMemo, useEffect } from "react";

function markdownConvert(string) {
    return string?.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

const IconReact = ({ skill, position = "top" }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [data, setData] = useState({});

    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch("/data.json");
                const json = await res.json();
                setData(json);
            } catch (error) {
                console.error("An error occurred while loading data.json:", error);
            }
        }
        loadData();
    }, []);

    const positionComputed = useMemo(() => {
        let style = {
            position: "absolute",
            marginBottom: "0.5rem",
            marginTop: "0.5rem",
            backgroundColor: "rgb(31 41 55)",
            color: "rgb(255 255 255)",
            fontSize: "0.675rem",
            paddingLeft: "0.75rem",
            paddingRight: "0.75rem",
            paddingTop: "0.25rem",
            paddingBottom: "0.25rem",
            borderRadius: "0.375rem",
            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
            zIndex: 10,
            whiteSpace: "normal",
            overflowWrap: "break-word",
            maxWidth: "75%",
            minWidth: "200px",
        }

        if (position === "top") {
            style = { ...style, bottom: "calc(100% + 0.5rem)", right: "25%" };
        } else if (position === "bottom") {
            style = { ...style, top: "calc(100% + 0.5rem)", left: "75%" };
        } else if (position === "bottom-left") {
            style = { ...style, top: "calc(100% + 0.5rem)", right: "100%" };
        } else if (position === "bottom-right") {
            style = { ...style, top: "calc(100% + 0.5rem)", left: "100%" };
        } else if (position === "top-right") {
            style = { ...style, bottom: "calc(100% + 0.5rem)", left: "100%" };
        } else if (position === "top-left") {
            style = { ...style, bottom: "calc(100% + 0.5rem)", right: "100%" };
        }

        return style;
    }, [position]);

    const imageLink = `https://skills.syvixor.com/api/icons?i=${skill}`;

    return (
        <div style={{ position: "relative" }}>
            <img
                src={imageLink}
                alt={`${skill} icon`}
                style={{
                    width: "fit-content",
                    height: "fit-content",
                    cursor: "pointer",
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            />

            {isHovered && (
                <div
                    style={positionComputed}
                    dangerouslySetInnerHTML={{
                        __html: markdownConvert(
                            data[skill] || "Description coming soon..."
                        ),
                    }}
                />
            )}
        </div>
    );
};

export default IconReact;