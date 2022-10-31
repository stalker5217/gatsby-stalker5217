---
title: '정렬'
date: '2020-11-05'
categories:
  - algorithm
tags:
  - algorithm
  - selection sort
  - quick sort
  - insertion sort
  - bubble sort
  - merge sort
  - heap sort
  - 기술 면접
description: '정렬의 종류에 대해서 알아봅시다'
indexImage: './cover.png'
---

# Sorting  

일차원으로 저장되어 있는 데이터를 정렬 하는 방법을 알아본다.  

정리하고자 하는 방식들의 Time Complexity는 아래와 같다.

|종류|Time Complexity|
|:--|:--|
|Bubble Sort| $ O(N^2) $ |
|Selection Sort| $ O(N^2) $ |
|Insertion Sort| $ O(N^2) $ |
|Heap Sort| $ O(NlgN) $ |
|Merge Sort| $ O(NlgN) $ |
|Quick Sort| $ O(NlgN) $ |

## Bubble Sort  

직관적이고 간단한 접근으로 해결한다. 
인접한 두 개의 데이터를 비교하며 위치를 찾아간다. 
이를 N-1번 반복하면 모든 데이터가 정렬된 결과를 얻을 수 있다. 

![bubble_sort](./bubble_sort.png) 

``` cpp
class Solution {
public:
    /**
     * Bubble Sort
     */
    vector<int> sortArray(vector<int>& nums) {
        for(int i = 0 ; i < nums.size() - 1 ; i++) {
            for (int j = 0 ; j < nums.size() - 1 ; j++) {
                if (nums[j] > nums[j + 1]) {
                    swap(nums[j], nums[j + 1]);
                }
            }
        }
        
        return nums;
    }
};
```

## Selection Sort  

길이가 N일 때 N번 순회를 하며 가장 우선 순위가 작거나 높은 요소를 찾아 맨 왼쪽 또는 오른쪽과 위치를 변경한다.

![selection_sort](./selection_sort.png) 

``` cpp
class Solution {
public:
    /**
     * Selection Sort
     */
    vector<int> sortArray(vector<int>& nums) {
        for(int i = 0 ; i < nums.size() - 1 ; i++) {
            int priorityIndex = i;
            for (int j = i + 1 ; j < nums.size() ; j++) {
                if (nums[priorityIndex] > nums[j]) {
                    priorityIndex = j;
                }
            }
            
            swap(nums[priorityIndex], nums[i]);
        }
        
        return nums;
    }
};
```

## Insertion Sort  

배열에서 정렬된 부분과 정렬이 아직되지 않은 부분을 구분한다. 
N번 순회를 하며 매 번 요소를 정렬된 부분의 적절한 위치에 삽입한다.

![insertion_sort](./insertion_sort.png)  

``` cpp
class Solution {
public:
    /**
     * Insertion Sort
     */
    vector<int> sortArray(vector<int>& nums) {
        for(int i = 1 ; i < nums.size() ; i++) {
            for(int j = i - 1 ; j >= 0 ; j--) {
                if (nums[j] > nums[j+1]) {
                    swap(nums[j], nums[j+1]);
                } else {
                    break;
                }
            }
        }
        
        return nums;
    }
};
```

## Heap Sort  

가장 우선 순위가 높은 데이터가 루트 노드에 존재하는 힙을 사용하여 정렬을 할 수 있다. 
N개 데이터를 모두 힙에 넣었다가 N번 ```pop```을 진행하면 정렬된 결과를 얻을 수 있다.  

힙의 push와 pop은 모두 $ O(lgN) $의 시간을 가지므로, 정렬 결과는 $ O(NlgN) $ 으로 구할 수 있다.

``` cpp
class Solution {
public:
    /**
     * Heap Sort
     */
    vector<int> sortArray(vector<int>& nums) {
        priority_queue<int, vector<int>, greater<int>> pq;
        for(int num : nums) {
            pq.push(num);
        }
        
        for(int i = 0 ; i < nums.size() ; i++) {
            nums[i] = pq.top();
            pq.pop();
        }
        
        return nums;
    }
};
```

## Merge Sort  

각 요소를 쪼갠 뒤 다시 합치는 divide & conquer 방식으로 정렬을 해결한다.

![merge_sort](./merge_sort.png)  

``` cpp
class Solution {
private:
    void mergeSort(vector<int>& nums, int left, int right) {
        if (left < right) {
            int mid = (left + right) / 2;
            
            mergeSort(nums, left, mid);
            mergeSort(nums, mid + 1 , right);
            
            mergeArea(nums, left, mid, right);
        }
    }
    
    void mergeArea(vector<int>& nums, int left, int mid, int right) {
        int index1 = left;
        int index2 = mid + 1;
        
        vector<int> result;
        
        while (index1 <= mid && index2 <= right) {
            if (nums[index1] <= nums[index2]) {
                result.push_back(nums[index1++]);
            } else {
                result.push_back(nums[index2++]);
            }
        }
        
        while (index1 <= mid) {
            result.push_back(nums[index1++]);
        }
        
        while (index2 <= right) {
            result.push_back(nums[index2++]);
        }
        
        for(int i = left ; i <= right ; i++) {
            nums[i] = result[i - left];
        }
    }
    
public:
    /**
     * Merge Sort
     */
    vector<int> sortArray(vector<int>& nums) {
        mergeSort(nums, 0, nums.size() - 1);
        return nums;
    }
};
```

## Quick Sort  

pivot이라는 기준 원소를 통해 divide & conquer 방식으로 정렬 결과를 구한다. 

1. 리스트에 있는 임의의 한 원소를 선택하며 이를 **pivot**이라고 한다.
2. pivot을 기준으로 보다 작은 우선 순위는 왼쪽으로 큰 우선 순위는 오른쪽으로 옮긴다.
3. pivot을 제외한 양 쪽을 크기가 0 또는 1이 될 때 까지 재귀적으로 호출한다.  


![quick_sort](./quick_sort.png)

``` cpp
class Solution {
private:
    void quickSort(vector<int>& nums, int left, int right) {
        if (left >= right) {
            return;
        }
        
        // 정렬 전 한 쪽으로 쏠려 있으면 O(n^2)까지 떨어짐
        int randomIndex = left + (rand() % (right - left + 1));
        swap(nums[left], nums[randomIndex]);
        
        int pivotIndex = partition(nums, left, right);
        
        quickSort(nums, left, pivotIndex - 1);
        quickSort(nums, pivotIndex + 1, right);
    }
    
    int partition(vector<int>& nums, int left, int right) {
        int& pivot = nums[left];
        
        int front = left + 1;
        int tail = right;
        
        while (true) {
            while(front <= right && pivot > nums[front]) {
                front++;
            }
            
            while(tail > left && pivot < nums[tail]) {
                tail--;
            }
            
            if (front < tail) {
                swap(nums[front++], nums[tail--]);
            } else {
				break;
			}
        }
        
        swap(pivot, nums[tail]);
        
        return tail;
    }
    
public:
    /**
     * Quick Sort
     */
    vector<int> sortArray(vector<int>& nums) {
        quickSort(nums, 0, nums.size() - 1);
        
        return nums;
    }
};
```