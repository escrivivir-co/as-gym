https://rasa.com/docs/rasa/components/#mitienlp


You can also pre-train your own word vectors from a language corpus using MITIE. To do so:

Get a clean language corpus (a Wikipedia dump works, or [AS-Seed.Corpus](/Users/morente/Desktop/THEIA_PATH/taller_tc/JE20/je20/fia/src/as-seed/guest/corpus)) as a set of text files.

Build and run MITIE Wordrep Tool on your corpus. This can take several hours/days depending on your dataset and your workstation. You'll need something like 128GB of RAM for wordrep to run – yes, that's a lot: try to extend your swap.

Set the path of your new total_word_feature_extractor.dat as the model parameter to the MitieNLP component in your configuration file.

