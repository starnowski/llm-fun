interface Situation {
    id: number;
    name: string;
    points: number;
}

const situations: Situation[] = [
    { id: 1, name: "Śmierć współmałżonka", points: 100 },
    { id: 2, name: "Rozwód", points: 73 },
    { id: 3, name: "Separacja małżeńska", points: 65 },
    { id: 4, name: "Pobyt w więzieniu", points: 63 },
    { id: 5, name: "Śmierć bliskiego członka rodziny", points: 63 },
    { id: 6, name: "Poważny uraz lub choroba", points: 53 },
    { id: 7, name: "Ślub", points: 50 },
    { id: 8, name: "Zwolnienie z pracy", points: 47 },
    { id: 9, name: "Przejście na emeryturę", points: 45 },
    { id: 10, name: "Pogorszenie stanu zdrowia członka rodziny", points: 44 },
    { id: 11, name: "Ciężka ciąża lub komplikacje okołoporodowe", points: 40 },
    { id: 12, name: "Problemy małżeńskie (poważne konflikty)", points: 39 },
    { id: 13, name: "Trudności finansowe", points: 38 },
    { id: 14, name: "Śmierć bliskiego przyjaciela", points: 37 },
    { id: 15, name: "Zmiana obowiązków w pracy (istotna)", points: 36 },
    { id: 16, name: "Rozstanie z partnerem/partnerką", points: 35 },
    { id: 17, name: "Znaczący kredyt lub hipoteka", points: 31 },
    { id: 18, name: "Utrata lub zmiana stanowiska", points: 31 },
    { id: 19, name: "Dziecko opuszcza dom (studia, wyprowadzka)", points: 29 },
    { id: 20, name: "Konflikty z teściami", points: 29 },
    { id: 21, name: "Wyjątkowe osiągnięcie osobiste", points: 28 },
    { id: 22, name: "Rozpoczęcie lub zakończenie pracy współmałżonka", points: 26 },
    { id: 23, name: "Syn lub córka żeni się / wychodzi za mąż", points: 26 },
    { id: 24, name: "Zmiana warunków pracy lub godzin", points: 23 },
    { id: 25, name: "Zmiana miejsca zamieszkania", points: 20 },
    { id: 26, name: "Zmiana szkoły (studia, przeprowadzka)", points: 20 },
    { id: 27, name: "Zmiana nawyków wypoczynku i rekreacji", points: 19 },
    { id: 28, name: "Zmiana aktywności towarzyskiej", points: 18 },
    { id: 29, name: "Mały kredyt lub pożyczka (np. sprzęt, auto)", points: 17 },
    { id: 30, name: "Zmiana nawyków snu", points: 16 },
    { id: 31, name: "Zmiana częstotliwości spotkań rodzinnych", points: 15 },
    { id: 32, name: "Zmiana nawyków żywieniowych", points: 15 },
    { id: 33, name: "Problemy w pracy o mniejszym nasileniu", points: 15 },
    { id: 34, name: "Zmiana hobby lub sposobu spędzania wolnego czasu", points: 15 },
    { id: 35, name: "Małe konflikty małżeńskie/partnerskie", points: 14 },
    { id: 36, name: "Zmiana przyzwyczajeń religijnych", points: 14 },
    { id: 37, name: "Zmiana zwyczajów społecznych (np. wyjścia, spotkania)", points: 13 },
    { id: 38, name: "Małe konflikty finansowe", points: 13 },
    { id: 39, name: "Nowe wymagania w pracy bez awansu", points: 12 },
    { id: 40, name: "Zmiana codziennych drobnych nawyków", points: 12 },
    { id: 41, name: "Ferie / krótki wyjazd wypoczynkowy", points: 12 },
    { id: 42, name: "Okres świąteczny (przygotowania, wydatki)", points: 12 },
    { id: 43, name: "Urlop / wakacje", points: 13 }
];

// --- Core Logic ---

interface Attempt {
    input: string;
    matchedSituation?: Situation;
    pointsAwarded: number;
}

class GameState {
    public score: number = 0;
    public attempts: Attempt[] = [];
    private matchedIds: Set<number> = new Set(); 

    public addAttempt(input: string, situation?: Situation) {
        if (situation) {
            // If already matched, we still record the attempt but maybe award 0 points to prevent spam?
            // For simplicity, we just award points every time they match, as the goal didn't specify.
            // Let's only award points if not already matched to make it a better game.
            let points = 0;
            if (!this.matchedIds.has(situation.id)) {
                points = situation.points;
                this.matchedIds.add(situation.id);
                this.score += points;
            }
            this.attempts.push({ input, matchedSituation: situation, pointsAwarded: points });
        } else {
            this.attempts.push({ input, pointsAwarded: 0 });
        }
    }

    public reset() {
        this.score = 0;
        this.attempts = [];
        this.matchedIds.clear();
    }
}

const gameState = new GameState();

// Utility function to normalize strings for comparison (lowercase + remove diacritics)
function normalizeString(str: string): string {
    return str
        .trim()
        .toLowerCase()
        // Replace polish diacritics for easier matching
        .replace(/ą/g, 'a')
        .replace(/ć/g, 'c')
        .replace(/ę/g, 'e')
        .replace(/ł/g, 'l')
        .replace(/ń/g, 'n')
        .replace(/ó/g, 'o')
        .replace(/ś/g, 's')
        .replace(/ź/g, 'z')
        .replace(/ż/g, 'z')
        // Remove spaces and non-alphanumeric characters for even more robust matching
        // so "urlop / wakacje" matches "urlopwakacje" and "urlop wakacje"
        .replace(/[^\w]/gi, '');
}

function processInput(input: string): Attempt {
    const normalizedInput = normalizeString(input);
    
    // Find a match
    const match = situations.find(s => normalizeString(s.name) === normalizedInput);
    
    gameState.addAttempt(input, match);
    return gameState.attempts[gameState.attempts.length - 1];
}

// --- DOM Manipulation ---

document.addEventListener("DOMContentLoaded", () => {
    const inputEl = document.getElementById("situation-input") as HTMLInputElement;
    const addBtn = document.getElementById("add-btn") as HTMLButtonElement;
    const resetBtn = document.getElementById("reset-btn") as HTMLButtonElement;
    const scoreEl = document.getElementById("total-score") as HTMLSpanElement;
    const historyListEl = document.getElementById("history-list") as HTMLUListElement;

    function renderState() {
        scoreEl.textContent = gameState.score.toString();
        
        historyListEl.innerHTML = "";
        
        // Render from newest to oldest for better UX
        const reversedAttempts = [...gameState.attempts].reverse();
        
        reversedAttempts.forEach(attempt => {
            const li = document.createElement("li");
            if (attempt.matchedSituation) {
                li.innerHTML = `<span class="match">${attempt.matchedSituation.name}</span>
                                <span>+${attempt.pointsAwarded} pkt</span>`;
            } else {
                li.innerHTML = `<span class="no-match">${attempt.input}</span>
                                <span class="no-match">❌</span>`;
            }
            historyListEl.appendChild(li);
        });
    }

    function handleAdd() {
        const text = inputEl.value;
        if (!text.trim()) return;
        
        processInput(text);
        inputEl.value = "";
        renderState();
    }

    addBtn.addEventListener("click", handleAdd);

    inputEl.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            handleAdd();
        }
    });

    resetBtn.addEventListener("click", () => {
        gameState.reset();
        renderState();
        inputEl.focus();
    });
});
