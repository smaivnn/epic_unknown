#  ecpic - unknown

**꾸준한 도전으로 나를 바꾸자**<br/>
**challenge little by little every day to change yourself**<br/>
- To-do 리스트와 캐릭터 육성 기능이 합쳐진 게임형 자기 관리 어플리케이션입니다.<br/>
- 하루의 목표는 운동, 공부 그 무엇이든 상관없습니다.<br/>
- 자격증, 수상과 같은 활동 진행시에도 경험치 증가로 캐릭터를 육성할 수 있습니다.<br/>
<br/>

## 개발 스택
### frontend
<img src="https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"/></a>
### backend
<img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"/></a>
<img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white"/></a>
<br/>

## 진행 상황
### 1차 개발 ( ~12.31)

기능|상태
|---|:---:|
|데이터베이스 설계|✅|
|auth|✅|
|todo|✅|
|경험치, 레벨업|👨🏻‍💻|
|캐릭터 육성||
|게시판||
|친구||
|알림||

<br/><br/>
## 팀 소개
### frontend
### backend
<table>
  <tbody>
    <tr>
      <td align="center"><a href=""><img src="https://github.com/smaivnn/epic_unknown/assets/85821828/9527928a-32bb-4cdd-989c-3aacc9feb4e6"width="100px;" alt=""/><br /><sub><b>최성민 </b></sub></a><br /></td>
    </tr>
  </tbody>
</table>


## 주요 기능
### todolist 완료 시 경험치 증가
<img width="574" alt="법칙적학습" src="https://github.com/smaivnn/epic_unknown/assets/85821828/cf3c74d5-4df8-4088-8618-5545a10af0db"><br/>


**의사 코드 설계**

```
// 이전 결정과 경험치 데이터 불러오기
const previousDecisions = database.loadPreviousDecisions();
const experienceData = database.loadExperienceData();

// 현재 결정을 만들기 위한 함수
function makeDecision() {
    // 이전 결정과 경험치 데이터를 기반으로 현재 결정 생성
    const availableCategories = categories.getAvailableCategories();
    const selectedCategory = selectCategory(availableCategories);
    return selectedCategory;
}

// 카테고리 선택 알고리즘
function selectCategory(availableCategories) {
    // 각 카테고리별로 이전 결정 및 경험치를 검토하여 최적의 카테고리 선택
    // 예를 들어, 각 카테고리별로 경험치를 살펴보고 가장 높은 경험치를 가진 카테고리를 선택
    let bestCategory = null;
    let bestExperience = -1;
    for (const category of availableCategories) {
        const categoryExperience = calculateCategoryExperience(category, previousDecisions, experienceData);
        if (categoryExperience > bestExperience) {
            bestCategory = category;
            bestExperience = categoryExperience;
        }
    }
    return bestCategory;
}

// 카테고리 경험치 계산
function calculateCategoryExperience(category, previousDecisions, experienceData) {
    // 이전 결정 중에서 해당 카테고리와 관련된 경험치를 찾아 계산
    let categoryExperience = 0;
    for (const decision of previousDecisions) {
        if (decision.category === category) {
            const relatedExperience = experienceData[decision.id] || 0;
            categoryExperience += relatedExperience;
        }
    }
    return categoryExperience;
}

// 현재 결정을 만들어 적용
const currentDecision = makeDecision();

// 경험치 업데이트 (경험치는 결과에 따라 증가)
const result = executeDecision(currentDecision);
updateExperience(currentDecision.id, result);

// 경험치 업데이트 함수
function updateExperience(decisionId, result) {
    if (result === 'success') {
        experienceData[decisionId] = (experienceData[decisionId] || 0) + 1;
    }
    // 경험치 데이터를 데이터베이스에 저장
    database.saveExperienceData(experienceData);
}
```

## 아키텍처

## License

Nest is [MIT licensed](LICENSE).
