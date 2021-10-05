package beans;


import java.util.ArrayList;
import java.util.List;

public class Entries {
    List<PointEntry> entries;

    public Entries() {
        this(new ArrayList<PointEntry>());
    }

    public Entries(ArrayList<PointEntry> entries) {
        this.entries = entries;
    }

    public List<PointEntry> getEntries() {
        return entries;
    }

    public void setEntries(List<PointEntry> entries) {
        this.entries = entries;
    }
}
