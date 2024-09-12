#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>

char **getFolders(const char *path, int *nbFolders)
{
    struct dirent *entry;
    DIR *dp;
    int count = 0;
    char **result = NULL;

    dp = opendir(path);
    if (dp == NULL)
    {
        return NULL;
    }

    while ((entry = readdir(dp)))
    {
        if (entry->d_type == DT_DIR &&
            strcmp(entry->d_name, ".") != 0 &&
            strcmp(entry->d_name, "..") != 0 &&
            strcmp(entry->d_name, "PrettyViewLocalhost") != 0 &&
            strcmp(entry->d_name, "command") != 0)
        {
            result = (char **)realloc(result, sizeof(char *) * (count + 1));
            result[count] = strdup(entry->d_name);
            count++;
        }
    }
    closedir(dp);
    *nbFolders = count;
    return result;
}

char **getFiles(const char *path, int *nbFiles)
{
    struct dirent *entry;
    DIR *dp;
    int count = 0;
    char **result = NULL;

    dp = opendir(path);
    if (dp == NULL)
    {
        return NULL;
    }

    while ((entry = readdir(dp)))
    {
        if (entry->d_type == DT_REG)
        {
            result = (char **)realloc(result, sizeof(char *) * (count + 1));
            result[count] = strdup(entry->d_name);
            count++;
        }
    }
    closedir(dp);
    *nbFiles = count;
    return result;
}

void dig(const char *path, char ***result, int *count)
{
    int nbFolders;
    char **folders = getFolders(path, &nbFolders);

    for (int i = 0; i < nbFolders; i++)
    {
        char currentPath[1024];
        snprintf(currentPath, sizeof(currentPath), "%s/%s", path, folders[i]);

        *result = (char **)realloc(*result, sizeof(char *) * (*count + 1));
        (*result)[*count] = strdup(currentPath);
        (*count)++;

        dig(currentPath, result, count);
    }

    for (int i = 0; i < nbFolders; i++)
    {
        free(folders[i]);
    }
    free(folders);
}

char ***collectTunnel(char **tunnel, int nbTunnel, int **nbFilesPerFolder)
{
    char ***result = (char ***)malloc(nbTunnel * sizeof(char **));
    *nbFilesPerFolder = (int *)malloc(nbTunnel * sizeof(int));

    for (int i = 0; i < nbTunnel; i++)
    {
        result[i] = getFiles(tunnel[i], &(*nbFilesPerFolder)[i]);
    }

    return result;
}

int main()
{
    char *location = "..";
    char **tunnel = NULL;
    int nbTunnel = 0;

    tunnel = (char **)realloc(tunnel, sizeof(char *));
    tunnel[nbTunnel] = strdup(location);
    nbTunnel++;

    dig(location, &tunnel, &nbTunnel);

    int *nbFilesPerFolder = NULL;
    char ***collection = collectTunnel(tunnel, nbTunnel, &nbFilesPerFolder);

    printf("{\n");
    for (int i = 0; i < nbTunnel; i++)
    {
        printf("  \"%s\": [\n", tunnel[i]);
        for (int j = 0; j < nbFilesPerFolder[i]; j++)
        {
            printf("    \"%s\"%s\n", collection[i][j], j < nbFilesPerFolder[i] - 1 ? "," : "");
        }
        printf("  ]%s\n", i < nbTunnel - 1 ? "," : "");
    }
    printf("}\n");

    for (int i = 0; i < nbTunnel; i++)
    {
        for (int j = 0; j < nbFilesPerFolder[i]; j++)
        {
            free(collection[i][j]);
        }
        free(collection[i]);
        free(tunnel[i]);
    }
    free(collection);
    free(tunnel);
    free(nbFilesPerFolder);

    return 0;
}
