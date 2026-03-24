package com.arribot.model;

import java.util.List;

public class WeeklyModule {

    private int weekNumber;
    private String weekTitle;
    private String weekGoal;
    private List<DailyMilestone> days;

    public WeeklyModule() {}

    public WeeklyModule(int weekNumber, String weekTitle, String weekGoal, List<DailyMilestone> days) {
        this.weekNumber = weekNumber;
        this.weekTitle = weekTitle;
        this.weekGoal = weekGoal;
        this.days = days;
    }

    // Getters and Setters
    public int getWeekNumber() { return weekNumber; }
    public void setWeekNumber(int weekNumber) { this.weekNumber = weekNumber; }

    public String getWeekTitle() { return weekTitle; }
    public void setWeekTitle(String weekTitle) { this.weekTitle = weekTitle; }

    public String getWeekGoal() { return weekGoal; }
    public void setWeekGoal(String weekGoal) { this.weekGoal = weekGoal; }

    public List<DailyMilestone> getDays() { return days; }
    public void setDays(List<DailyMilestone> days) { this.days = days; }
}
