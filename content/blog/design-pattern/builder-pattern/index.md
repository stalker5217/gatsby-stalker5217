---
title: 'GoF - Builder 패턴'
date: '2022-06-30'
categories:
  - design pattern
tags:
  - design pattern
  - 기술 면접
description: '빌더 패턴에 대해 알아봅시다.'
indexImage: './cover.png'
---

## Builder Pattern  

빌더 패턴은 복잡한 구조의 객체의 표현과 생성을 분리한다. 
그리고 생성 과정을 캡슐화하여 동일한 인스턴스 생성 프로세스를 사용하여, 다양한 구성을 할 수 있도록 하는 패턴이다. 

예를 들어, 아래와 같이 휴가를 나타내는 객체가 존재한다고 하자. 
휴가는 일련의 이벤트와 숙박 정보로 이루어지며, 숙박 정보는 내부에 예약에 대한 정보를 가진다. 

``` java
public class Vacation {
	String name;
	List<Accommodation> accommodations = new ArrayList<Accommodation>();
	List<String> events = new ArrayList<String>();
 
	public void setName(String name) {
		this.name = name;
	}

	public void setAccommodations(List<Accommodation> accommodations) {
		this.accommodations = accommodations;
	}

	public void setEvents(List<String> events) {
		this.events = events;
	}

	public String toString() {
		StringBuffer display = new StringBuffer();
		display.append("---- " + this.name + " ----\n");

		for (Accommodation a : accommodations) {
			display.append(a);
		}
		for (String e : events) {
			display.append(e + "\n");
		}

		return display.toString();
	}
}
```

``` java
public abstract class Accommodation {
	String name;
	Reservation reservation = null;
	
	public void setReservation(Reservation r) {
		this.reservation = r;
	}

	public Reservation getReservation() {
		return this.reservation;
	}

	public abstract String getLocation();

	public String toString() {
		StringBuffer display = new StringBuffer();
		display.append("You're staying at " + name);
		
		if (this.reservation != null) {
			display.append("\nYou have a reservation for arrival date: " + reservation.getArrivalDate() + 
					", staying for " + reservation.getNights() + " nights");
		}
		
		if (this.getLocation() != "") {
			display.append(" in " + this.getLocation());
		}
		display.append("\n");
		
		return display.toString();
	}
}

---------------------------------------------

public class Tent extends Accommodation {
	int siteNumber;

	public Tent() {
		this.name = "Tent";
	}

	public Tent(String name) {
		this.name = name;
	}

	public void setSiteNumber(int n) {
		this.siteNumber = n;
	}

	public int getSiteNumber() {
		return this.siteNumber;
	}

	public String getLocation() {
		if (siteNumber == 0) return "";
		else return "Site number " + this.siteNumber;
	}
}

---------------------------------------------

public class Hotel extends Accommodation {
	int roomNumber;

	public Hotel() {
		this.name = "Hotel";
	}

	public Hotel(String name) {
		this.name = name;
	}

	public void setRoomNumber(int n) {
		this.roomNumber = n;
	}

	public int getRoomNumber() {
		return this.roomNumber;
	}

	public String getLocation() {
		if (roomNumber == 0) return "";
		else return "Room number " + this.roomNumber;
	}
}
```

``` java
public class Reservation {
	LocalDate arrivalDate;
	int nights;
	
	public void setArrivalDate(int year, int month, int day) {
		this.arrivalDate = LocalDate.of(year, month, day);
	}

	public LocalDate getArrivalDate() {
		return this.arrivalDate;
	}

	public void setNights(int nights) {
		this.nights = nights;
	}

	public int getNights() {
		return this.nights;
	}
}
```

클라이언트에서 이 휴가를 나타내는 인스턴스를 생성하려면 어떻게 해야할까? 
위 코드만 존재한다면 ```new``` 키워드를 통해 인스턴스를 생성하고 필요한 모든 내용들을 일일히 setter를 통해 세팅해줘야 한다. 

하지만 이 방법은 객체를 생성하기 위해 클라이언트가 모든 구조를 알고 있다는 전제가 있어야 한다. 
만약 필수 값이 존재한다거나, 값에 대한 검증, 또 생성을 하는데 있어 순서 제어가 필요한 경우 이를 클라이언트에 모두 위임할 수 밖에 없다. 
또한 객체를 생성하기 위해서 너무 많은 메서드를 호출해야 되며, 모든 값을 설정하기 전에는 객체가 일관성이 무너진 상태에 놓이게 된다는 점 또한 문제가 된다. 

빌더 패턴에서는 이를 해결하기 위해 객체의 생성을 담당하는 **빌더 클래스를 제공**하여 클라이언트에서 일관된 방법으로 인스턴스를 생성할 수 있도록 한다.

### 패턴 적용  

``` java
public abstract class VacationBuilder {
	String name;
	List<Accommodation> accommodations = new ArrayList<Accommodation>();
	List<String> events = new ArrayList<String>();
	
	public abstract VacationBuilder addAccommodation();
	public abstract VacationBuilder addAccommodation(String name);
	public abstract VacationBuilder addAccommodation(String name, int year, int month, int day, int nights, int location);
	public abstract VacationBuilder addEvent(String event);
	
	public Vacation getVacation() {
		Vacation vacation = new Vacation();
		vacation.setName(name);
		vacation.setAccommodations(accommodations);
		vacation.setEvents(events);
		return vacation;
	}
}

---------------------------------------------

public class OutdoorsVacationBuilder extends VacationBuilder {	
	public OutdoorsVacationBuilder() {
		this.name = "Outdoorsy Vacation Builder";
	}

	public VacationBuilder addAccommodation() {
		this.accommodations.add(new Tent());
		return this;
	}

	public VacationBuilder addAccommodation(String name) {
		this.accommodations.add(new Tent(name));
		return this;
	}

	public VacationBuilder addAccommodation(String name, int year, int month, int day, int nights, int location) {
		Reservation reservation = new Reservation();
		reservation.setArrivalDate(year, month, day);
		reservation.setNights(nights);
		
		Tent tent = new Tent(name);
		tent.setReservation(reservation);
		tent.setSiteNumber(location);
		this.accommodations.add(tent);
		return this;
	}

	public VacationBuilder addEvent(String event) {
		this.events.add("Hike: " + event);
		return this;
	}
}

---------------------------------------------

public class CityVacationBuilder extends VacationBuilder {	
	public CityVacationBuilder() {
		this.name = "City Vacation Builder";
	}

	public VacationBuilder addAccommodation() {
		this.accommodations.add(new Hotel());
		return this;
	}

	public VacationBuilder addAccommodation(String name) {
		this.accommodations.add(new Hotel(name));
		return this;
	}

	public VacationBuilder addAccommodation(String name, int year, int month, int day, int nights, int location) {
		Reservation reservation = new Reservation();
		reservation.setArrivalDate(year, month, day);
		reservation.setNights(nights);
		
		Hotel hotel = new Hotel(name);
		hotel.setReservation(reservation);
		hotel.setRoomNumber(location);
		this.accommodations.add(hotel);
		return this;
	}

	public VacationBuilder addEvent(String event) {
		this.events.add("See the " + event + " show");
		return this;
	}
}
```

``` java
VacationBuilder outdoorsyVacationBuilder = new OutdoorsVacationBuilder();
Vacation outdoorsyVacation = outdoorsyVacationBuilder
		.addAccommodation("Two person tent", 2020, 7, 1, 5, 34)
		.addEvent("Beach")
		.addAccommodation("Two person tent")
		.addEvent("Mountains")
		.getVacation();
System.out.println(outdoorsyVacation);

VacationBuilder cityVacationBuilder = new CityVacationBuilder();
Vacation cityVacation = cityVacationBuilder
		.addAccommodation("Grand Facadian", 2020, 8, 1, 5, 0)
		.addAccommodation("Hotel Commander", 2020, 8, 6, 2, 0)
		.addEvent("Cirque du Soleil")
		.getVacation();
System.out.println(cityVacation);
```

<br/>

참고
- 에릭 프리먼, 엘리자베스 롭슨, 키이시 시에라, 버트 베이츠, 헤드 퍼스트 디자인 패턴, 서환수, 한빛미디어
- https://github.com/bethrobson/Head-First-Design-Patterns
- Joshua Bloch, Effective Java, 프로그래밍인사이트 