#include <iostream>
#include <conio.h> // For _kbhit() and _getch() on Windows; consider ncurses for Linux
#include <windows.h> // For Sleep() and console manipulation on Windows
#include <ctime>
#include <cstdlib>

using namespace std;

// Global variables for game state
bool gameOver;
const int width = 20;
const int height = 20;
int headX, headY, fruitX, fruitY, score;
int tailX[100], tailY[100];
int tailLength;
enum eDirection { STOP = 0, LEFT, RIGHT, UP, DOWN };
eDirection dir;

void Setup() {
    gameOver = false;
    dir = STOP;
    headX = width / 2;
    headY = height / 2;
    // Initialize fruit at random location
    srand(time(NULL));
    fruitX = rand() % width;
    fruitY = rand() % height;
    score = 0;
    tailLength = 0;
}

void Draw() {
    system("cls"); // Clear console screen (use "clear" on Linux)
    // Draw top wall
    for (int i = 0; i < width + 2; i++)
        cout << "#";
    cout << endl;

    for (int i = 0; i < height; i++) {
        for (int j = 0; j < width; j++) {
            if (j == 0)
                cout << "#"; // Draw left wall
            
            // Draw head
            if (i == headY && j == headX)
                cout << "O";
            // Draw fruit
            else if (i == fruitY && j == fruitX)
                cout << "F";
            else {
                bool printTail = false;
                // Draw tail segments
                for (int k = 0; k < tailLength; k++) {
                    if (tailX[k] == j && tailY[k] == i) {
                        cout << "o";
                        printTail = true;
                        break;
                    }
                }
                if (!printTail)
                    cout << " ";
            }

            if (j == width - 1)
                cout << "#"; // Draw right wall
        }
        cout << endl;
    }

    // Draw bottom wall
    for (int i = 0; i < width + 2; i++)
        cout << "#";
    cout << endl;
    cout << "Score: " << score << endl;
}

void Input() {
    if (_kbhit()) { // Check for keyboard input
        switch (_getch()) { // Get the character
            case 'a':
                if (dir != RIGHT) dir = LEFT;
                break;
            case 'd':
                if (dir != LEFT) dir = RIGHT;
                break;
            case 'w':
                if (dir != DOWN) dir = UP;
                break;
            case 's':
                if (dir != UP) dir = DOWN;
                break;
            case 'x':
                gameOver = true;
                break;
        }
    }
}

void Logic() {
    // Move tail segments
    int prevX = tailX[0];
    int prevY = tailY[0];
    int prev2X, prev2Y;
    tailX[0] = headX;
    tailY[0] = headY;
    for (int i = 1; i < tailLength; i++) {
        prev2X = tailX[i];
        prev2Y = tailY[i];
        tailX[i] = prevX;
        tailY[i] = prevY;
        prevX = prev2X;
        prevY = prev2Y;
    }

    // Move head based on direction
    switch (dir) {
        case LEFT:
            headX--;
            break;
        case RIGHT:
            headX++;
            break;
        case UP:
            headY--;
            break;
        case DOWN:
            headY++;
            break;
        default:
            break;
    }

    // Check for wall collision (wraps around)
    if (headX >= width) headX = 0; else if (headX < 0) headX = width - 1;
    if (headY >= height) headY = 0; else if (headY < 0) headY = height - 1;

    // Check for tail collision
    for (int i = 0; i < tailLength; i++) {
        if (tailX[i] == headX && tailY[i] == headY)
            gameOver = true;
    }

    // Check if fruit is eaten
    if (headX == fruitX && headY == fruitY) {
        score += 10;
        fruitX = rand() % width;
        fruitY = rand() % height;
        tailLength++;
    }
}

int main() {
    Setup();
    while (!gameOver) {
        Draw();
        Input();
        Logic();
        Sleep(50); // Small delay to control game speed
    }
    cout << "Game Over! Final Score: " << score << endl;
    return 0;
}
