import { pipeline } from '@xenova/transformers';
import { createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';

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

// --- Database & AI Setup (Step 2) ---

export let db: any;
export let extractor: any;

async function initDB() {
    db = await createRxDatabase({
        name: 'sterosdb',
        storage: getRxStorageDexie()
    });

    await db.addCollections({
        situations: {
            schema: {
                version: 0,
                primaryKey: 'id',
                type: 'object',
                properties: {
                    id: { type: 'string', maxLength: 100 },
                    name: { type: 'string' },
                    points: { type: 'number' },
                    embedding: {
                        type: 'array',
                        items: { type: 'number' }
                    }
                },
                required: ['id', 'name', 'points', 'embedding']
            }
        }
    });

    return db;
}

async function initializeApp(statusEl: HTMLElement, inputEl: HTMLInputElement, addBtn: HTMLButtonElement) {
    if (statusEl) statusEl.textContent = 'Trwa ładowanie modelu AI (Transformers.js)...';

    // 1. Load the model
    // Using a fast, small multilingual model
    extractor = await pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2', {
        quantized: true,
    });

    if (statusEl) statusEl.textContent = 'Inicjalizacja lokalnej bazy danych (RxDB)...';

    // 2. Load RxDB
    await initDB();

    // 3. Populate Database if empty
    const existingCount = await db.situations.find().exec();
    if (existingCount.length === 0) {
        if (statusEl) statusEl.textContent = 'Generowanie wektorów dla sytuacji stresowych...';
        
        for (const sit of situations) {
            const output = await extractor(sit.name, { pooling: 'mean', normalize: true });
            const embedding = Array.from(output.data);
            
            await db.situations.insert({
                id: sit.id.toString(),
                name: sit.name,
                points: sit.points,
                embedding: embedding
            });
        }
    }

    if (statusEl) {
        statusEl.textContent = 'Wszystkie sytuacje zostały zapisane w bazie danych!';
        statusEl.style.color = '#28a745';
    }
    
    // Enable inputs
    if (inputEl) inputEl.disabled = false;
    if (addBtn) addBtn.disabled = false;
}

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
// Will be removed in Step 4, keeping for now
function normalizeString(str: string): string {
    return str
        .trim()
        .toLowerCase()
        .replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e').replace(/ł/g, 'l')
        .replace(/ń/g, 'n').replace(/ó/g, 'o').replace(/ś/g, 's').replace(/ź/g, 'z').replace(/ż/g, 'z')
        .replace(/[^\w]/gi, '');
}

function processInput(input: string): Attempt {
    const normalizedInput = normalizeString(input);
    const match = situations.find(s => normalizeString(s.name) === normalizedInput);
    gameState.addAttempt(input, match);
    return gameState.attempts[gameState.attempts.length - 1];
}

// --- DOM Manipulation ---

document.addEventListener("DOMContentLoaded", () => {
    const statusEl = document.getElementById("db-status") as HTMLElement;
    const inputEl = document.getElementById("situation-input") as HTMLInputElement;
    const addBtn = document.getElementById("add-btn") as HTMLButtonElement;
    const resetBtn = document.getElementById("reset-btn") as HTMLButtonElement;
    const scoreEl = document.getElementById("total-score") as HTMLSpanElement;
    const historyListEl = document.getElementById("history-list") as HTMLUListElement;

    // Start initialization process immediately when DOM is ready
    initializeApp(statusEl, inputEl, addBtn).catch(console.error);

    function renderState() {
        scoreEl.textContent = gameState.score.toString();
        
        historyListEl.innerHTML = "";
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
