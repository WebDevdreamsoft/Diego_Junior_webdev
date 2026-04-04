#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

#define MAX_NUMBERS 100
#define MAX_ARRAYS 2010

// Function to check if an array is safe (original rules)
bool isSafeArray(int arr[], int length) {
    if (length <= 1) {
        return true;
    }
    
    int direction = 0; // 0 = unknown, 1 = increasing, -1 = decreasing
    int diff;
    
    for (int i = 1; i < length; i++) {
        diff = arr[i] - arr[i-1];
        
        // Check if the difference is within the allowed range (1, 2, or 3 in absolute value)
        int absDiff = abs(diff);
        if (absDiff < 1 || absDiff > 3) {
            return false;
        }
        
        // Determine direction for this step
        if (diff > 0) {
            if (direction == -1) {
                return false;
            }
            direction = 1;
        } else if (diff < 0) {
            if (direction == 1) {
                return false;
            }
            direction = -1;
        }
    }
    
    return true;
}

// Function to check if removing a single element makes the array safe
bool isFixableByRemovingOne(int arr[], int length) {
    // If already safe, return true
    if (isSafeArray(arr, length)) {
        return true;
    }
    
    // Try removing each element one by one
    for (int removeIndex = 0; removeIndex < length; removeIndex++) {
        // Create a temporary array without the element at removeIndex
        int temp[MAX_NUMBERS];
        int tempLen = 0;
        
        for (int i = 0; i < length; i++) {
            if (i != removeIndex) {
                temp[tempLen++] = arr[i];
            }
        }
        
        // Check if this modified array is safe
        if (isSafeArray(temp, tempLen)) {
            return true;
        }
    }
    
    return false;
}

// Function to fix and print the array (if fixable)
void printFixedArray(int arr[], int length) {
    // If already safe, print as is
    if (isSafeArray(arr, length)) {
        printf("  Original (already safe): ");
        for (int i = 0; i < length; i++) {
            printf("%d ", arr[i]);
        }
        printf("\n");
        return;
    }
    
    // Try removing each element
    for (int removeIndex = 0; removeIndex < length; removeIndex++) {
        int temp[MAX_NUMBERS];
        int tempLen = 0;
        
        for (int i = 0; i < length; i++) {
            if (i != removeIndex) {
                temp[tempLen++] = arr[i];
            }
        }
        
        if (isSafeArray(temp, tempLen)) {
            printf("  Fixed by removing element at position %d (value %d): ", 
                   removeIndex + 1, arr[removeIndex]);
            for (int i = 0; i < tempLen; i++) {
                printf("%d ", temp[i]);
            }
            printf("\n");
            return;
        }
    }
    
    printf("  Cannot be fixed\n");
}

// Function to read arrays from a file
int readArraysFromFile(const char *filename, int arrays[MAX_ARRAYS][MAX_NUMBERS], int lengths[MAX_ARRAYS]) {
    FILE *file = fopen(filename, "r");
    if (file == NULL) {
        printf("Error: Could not open file '%s'\n", filename);
        return -1;
    }
    
    int numArrays = 0;
    char line[2000];
    
    while (fgets(line, sizeof(line), file) != NULL && numArrays < MAX_ARRAYS) {
        // Skip empty lines
        if (line[0] == '\n') continue;
        
        int length = 0;
        char *ptr = line;
        int num;
        
        while (sscanf(ptr, "%d", &num) == 1 && length < MAX_NUMBERS) {
            arrays[numArrays][length++] = num;
            
            // Move to next number
            while (*ptr == ' ') ptr++;
            while (*ptr != ' ' && *ptr != '\0' && *ptr != '\n') ptr++;
            if (*ptr == '\0' || *ptr == '\n') break;
        }
        
        if (length > 0) {
            lengths[numArrays] = length;
            numArrays++;
        }
    }
    
    fclose(file);
    return numArrays;
}

// Function to print array
void printArray(int arr[], int length) {
    printf("[");
    for (int i = 0; i < length; i++) {
        printf("%d", arr[i]);
        if (i < length - 1) printf(", ");
    }
    printf("]");
}

int main() {
    int choice;
    int arrays[MAX_ARRAYS][MAX_NUMBERS];
    int lengths[MAX_ARRAYS];
    int numArrays;
    
    printf("=== Array Safety Checker with Problem Dampener ===\n");
    printf("Rules:\n");
    printf("1. All numbers must either strictly increase OR strictly decrease\n");
    printf("2. The difference between consecutive numbers must be 1, 2, or 3\n");
    printf("3. If removing ONE element makes the array safe, it counts as safe\n\n");
    
    printf("Choose input method:\n");
    printf("1. Read arrays from keyboard\n");
    printf("2. Read arrays from file\n");
    printf("Enter your choice (1 or 2): ");
    scanf("%d", &choice);
    getchar(); // Consume newline
    
    if (choice == 1) {
        printf("How many arrays do you want to check? ");
        scanf("%d", &numArrays);
        getchar(); // Consume newline
        
        printf("Enter each array as space-separated numbers on separate lines:\n");
        for (int i = 0; i < numArrays; i++) {
            printf("Array %d: ", i + 1);
            char buffer[1000];
            fgets(buffer, sizeof(buffer), stdin);
            
            int length = 0;
            char *ptr = buffer;
            int num;
            
            while (sscanf(ptr, "%d", &num) == 1 && length < MAX_NUMBERS) {
                arrays[i][length++] = num;
                while (*ptr == ' ') ptr++;
                while (*ptr != ' ' && *ptr != '\0' && *ptr != '\n') ptr++;
                if (*ptr == '\0' || *ptr == '\n') break;
            }
            lengths[i] = length;
        }
    } else if (choice == 2) {
        char filename[256];
        printf("Enter the filename: ");
        fgets(filename, sizeof(filename), stdin);
        filename[strcspn(filename, "\n")] = 0;
        
        numArrays = readArraysFromFile(filename, arrays, lengths);
        if (numArrays < 0) {
            return 1;
        }
        printf("Read %d arrays from file\n", numArrays);
    } else {
        printf("Invalid choice!\n");
        return 1;
    }
    
    // Check each array and display results
    printf("\n=== Results ===\n");
    int safeCount = 0;
    int unsafeCount = 0;
    int fixableCount = 0;
    
    for (int i = 0; i < numArrays; i++) {
        printf("\nArray %d: ", i + 1);
        printArray(arrays[i], lengths[i]);
        
        if (isSafeArray(arrays[i], lengths[i])) {
            printf(" -> SAFE (original) ✓\n");
            safeCount++;
        } else if (isFixableByRemovingOne(arrays[i], lengths[i])) {
            printf(" -> SAFE (fixable by removing one element) ✓\n");
            printFixedArray(arrays[i], lengths[i]);
            safeCount++;
            fixableCount++;
        } else {
            printf(" -> UNSAFE (cannot be fixed) ✗\n");
            unsafeCount++;
        }
    }
    
    printf("\n=== Summary ===\n");
    printf("Total arrays: %d\n", numArrays);
    printf("Safe arrays: %d\n", safeCount);
    printf("  - Originally safe: %d\n", safeCount - fixableCount);
    printf("  - Fixable by removing one element: %d\n", fixableCount);
    printf("Unsafe arrays (cannot be fixed): %d\n", unsafeCount);
    
    return 0;
}