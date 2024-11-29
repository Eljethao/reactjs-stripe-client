// src/ListCardsPage.js
import React, { useState, useEffect } from 'react';
import './ListCardsPage.css';
import { token } from './config';

const ListCardsPage = () => {
    const [cards, setCards] = useState([]);
    const [user, setUser] = useState();

    useEffect(() => {
        getAllUserCard();
        getUserData();
    }, []);

    const getUserData = () => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            };

            fetch("http://localhost:8000/v1/api/users/670494c4e7470be3dc4f933e", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    console.log("User Data:", result);
                    setUser(result.user);
                })
                .catch((error) => console.error("Error fetching user data:", error));
        } catch (error) {
            console.log("Error:", error);
        }
    };

    const getAllUserCard = () => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            };

            fetch("http://localhost:9090/v1/api/cards", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    console.log("Cards Data:", result);
                    setCards(result.data);
                })
                .catch((error) => console.error("Error fetching cards:", error));
        } catch (error) {
            console.log("Error:", error);
        }
    };

    const changeDefaultCard = (paymentMethodId) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const raw = JSON.stringify({
            paymentMethodId: paymentMethodId,
        });

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        fetch(
            "http://localhost:9090/v1/api/cards/default-card/670494c4e7470be3dc4f933e",
            requestOptions
        )
            .then((response) => response.json())
            .then((result) => {
                console.log("Default card updated:", result);
                // Update user data to reflect the new default card
                setUser((prevUser) => ({
                    ...prevUser,
                    defaultCard: paymentMethodId,
                }));
            })
            .catch((error) => console.error("Error changing default card:", error));
    };

    return (
        <div className="list-cards-page">
            <h1>My Cards</h1>
            <div className="cards-container">
                {cards?.map((card) => (
                    <div
                        key={card.id}
                        className={`card ${user?.defaultCard === card.id ? 'default-card' : ''}`}
                    >
                        <div className="card-header">
                            <h2>{card.cardName}</h2>
                        </div>
                        <div className="card-body">
                            <p className="card-number">
                                **** **** **** {card.cardId}
                            </p>
                            <p>
                                <strong>Expires:</strong> {card.expireMonth}/{card.expireYear}
                            </p>
                        </div>
                        <div className="card-footer">
                            <p>{card.brand}</p>
                        </div>
                        {user?.defaultCard === card.id && (
                            <span className="default-badge">Default</span>
                        )}
                        <button
                            className="set-default-button"
                            onClick={() => changeDefaultCard(card.id)}
                        >
                            Set as Default
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListCardsPage;
