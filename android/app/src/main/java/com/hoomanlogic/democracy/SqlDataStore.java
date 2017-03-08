package com.hoomanlogic.democracy;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteException;
import android.database.sqlite.SQLiteOpenHelper;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * Created by owner on 3/7/17.
 */

public class SqlDataStore extends SQLiteOpenHelper {
    private static String mPATH = "/data/data/com.hoomanlogic.democracy/databases/";
    private static String mNAME = "democracy.db";
    private final Context mContext;

    public SqlDataStore(Context context) {
        super(context, mNAME, null, BuildConfig.VERSION_CODE);
        this.mContext = context;
    }

    @Override
    public void onConfigure(SQLiteDatabase db) {
        db.setForeignKeyConstraintsEnabled(true);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        try {
            this.initialize();
        } catch (IOException e) {
            throw new Error(e.getMessage());
        }
        //this.upgradeDbSchema(db, 0, BuildConfig.VERSION_CODE));
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        this.upgradeDbSchema(db, oldVersion, newVersion);
    }

    @Override
    public void onDowngrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        this.downgradeDbSchema(db, oldVersion, newVersion);
    }

    public void initialize() throws IOException {
        // Path to the created empty db
        String path = mPATH + mNAME;

        // Check if db was already created
        SQLiteDatabase checkDb = null;
        try {
            checkDb = SQLiteDatabase.openDatabase(path, null, SQLiteDatabase.OPEN_READONLY);
        }
        catch (SQLiteException e) {
            // Database doesn't exist yet
        }

        // Already exists, close it and abort
        if (checkDb != null) {
            checkDb.close();
            return;
        }

        // By calling this method an empty db will be created into the default system path
        // then we can overwrite that blank db with this db
        this.getReadableDatabase();

        // Open your local db as the input stream\
        InputStream readStream = mContext.getAssets().open(mNAME);

        // Open empty db as output stream
        OutputStream writeStream = new FileOutputStream(path);

        // Transfer bytes from the input stream to output stream
        byte[] buffer = new byte[1024];
        int length;
        while ((length = readStream.read(buffer)) > 0) {
            writeStream.write(buffer, 0, length);
        }

        // Close streams
        readStream.close();
        writeStream.flush();
        writeStream.close();
    }

    private void downgradeDbSchema(SQLiteDatabase db, int oldVersion, int newVersion) {
        switch (oldVersion) {
            case 1:
                db.execSQL("DROP TABLE body");
                db.execSQL("DROP TABLE division");
                db.execSQL("DROP TABLE politician");
                db.execSQL("DROP TABLE membership");
                db.execSQL("DROP TABLE value");
                db.execSQL("DROP TABLE motion");
                db.execSQL("DROP TABLE value_activity");
                db.execSQL("DROP TABLE vote");
                db.execSQL("DROP TABLE data_version");
            case 0:
                if (newVersion == 0) {
                    return;
                }
        }
    }

    private void upgradeDbSchema(SQLiteDatabase db, int oldVersion, int newVersion) {
        switch (oldVersion) {
            case 0:
//                db.execSQL(
//                    "CREATE TABLE body (" +
//                        "id TEXT PRIMARY KEY," +
//                        "name TEXT," +
//                        "jurisdiction TEXT" +
//                    ")"
//                );
//                db.execSQL(
//                    "CREATE TABLE division (" +
//                        "id TEXT," +
//                        "bodyId TEXT," +
//                        "name TEXT," +
//                        "UNIQUE (id, bodyId) ON CONFLICT REPLACE," +
//                        "FOREIGN KEY(bodyId) REFERENCES body(id)" +
//                    ")"
//                );
//                db.execSQL(
//                    "CREATE TABLE politician (" +
//                        "id INTEGER PRIMARY KEY AUTOINCREMENT," +
//                        "icon TEXT," +
//                        "name TEXT," +
//                        "sort TEXT," +
//                        "wiki TEXT" +
//                    ")"
//                );
//                db.execSQL(
//                    "CREATE TABLE membership (" +
//                        "politicianId INTEGER," +
//                        "bodyId TEXT," +
//                        "divisionId TEXT," +
//                        "refId TEXT," +
//                        "termEnd TEXT," +
//                        "UNIQUE (politicianId, bodyId) ON CONFLICT REPLACE," +
//                        "FOREIGN KEY(bodyId) REFERENCES body(id)," +
//                        "FOREIGN KEY(divisionId) REFERENCES division(id)," +
//                        "FOREIGN KEY(politicianId) REFERENCES politician(id)" +
//                    ")"
//                );
//                db.execSQL(
//                    "CREATE TABLE value (" +
//                        "id TEXT PRIMARY KEY," +
//                        "icon TEXT," +
//                        "name TEXT" +
//                    ")"
//                );
//                db.execSQL("INSERT INTO value (id, icon, name) VALUES ('education', '//www.freeiconspng.com/uploads/education-png-32.png', 'Education')");
//                db.execSQL("INSERT INTO value (id, icon, name) VALUES ('environment', '//www.onegov.nsw.gov.au/New/persistent/listings_page/environment.png', 'Environment')");
//                db.execSQL("INSERT INTO value (id, icon, name) VALUES ('equality', '//pbs.twimg.com/profile_images/565486644740911104/UQPE6tgy_reasonably_small.png', 'Equality')");
//                db.execSQL(
//                    "CREATE TABLE motion (" +
//                        "id INTEGER PRIMARY KEY AUTOINCREMENT," +
//                        "bodyId TEXT," +
//                        "name TEXT," +
//                        "date TEXT," +
//                        "pass INTEGER," +
//                        "tiebreaker TEXT," +
//                        "tiebreakerId INTEGER," +
//                        "tiebreakerVote INTEGER," +
//                        "FOREIGN KEY(bodyId) REFERENCES body(id)," +
//                        "FOREIGN KEY(tiebreakerId) REFERENCES politician(id)" +
//                    ")"
//                );
//                db.execSQL(
//                    "CREATE TABLE value_activity (" +
//                        "valueId TEXT PRIMARY KEY," +
//                        "motionId INTEGER," +
//                        "FOREIGN KEY(motionId) REFERENCES motion(id)" +
//                    ")"
//                );
//                db.execSQL(
//                    "CREATE TABLE vote (" +
//                        "motionId INTEGER," +
//                        "politicianId INTEGER," +
//                        "vote INTEGER," +
//                        "UNIQUE (politicianId, motionId) ON CONFLICT REPLACE," +
//                        "FOREIGN KEY(motionId) REFERENCES motion(id)," +
//                        "FOREIGN KEY(politicianId) REFERENCES politician(id)" +
//                    ")"
//                );
//                db.execSQL(
//                    "CREATE TABLE data_version (" +
//                        "versionNumber INTEGER" +
//                    ")"
//                );
//                db.execSQL(
//                    "INSERT INTO data_version (versionNumber) VALUES (0)"
//                );
            case 1:
                if (newVersion == 1) {
                    return;
                }
        }
    }
}
